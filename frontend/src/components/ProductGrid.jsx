import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/ProductGrid.css";
import { mockProducts } from "../data/mockCatalog";
import { addToCart, getProducts, getProductById } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { localAddToCart } from "../utils/localCart";

function normalizeCategory(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getUniqueRandomProducts(apiProducts, mockProducts) {
  const map = new Map();

  apiProducts.forEach((p) => map.set(p.name, p));

  mockProducts.forEach((p) => {
    if (!map.has(p.name)) {
      map.set(p.name, p);
    }
  });

  const allUnique = Array.from(map.values());

  for (let i = allUnique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allUnique[i], allUnique[j]] = [allUnique[j], allUnique[i]];
  }

  return allUnique;
}

export default function ProductGrid({ category, searchQuery, onCartUpdated }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const selectedCategory = category || "all";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const apiProducts = await getProducts({
          category: selectedCategory,
          q: searchQuery || undefined,
        });

        const normalizedApiProducts = (
          Array.isArray(apiProducts) ? apiProducts : []
        ).map((product) => ({
          ...product,
          categoryKey:
            product.category_key || normalizeCategory(product.category),
          image_url:
            product.image_url ||
            "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80",
        }));

        setAllProducts(getUniqueRandomProducts(normalizedApiProducts, mockProducts));
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Showing local products. Backend is unavailable right now.");
        setAllProducts(getUniqueRandomProducts([], mockProducts));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : allProducts.filter((product) => {
          const key =
            product.categoryKey || normalizeCategory(product.category);
          return key === selectedCategory;
        });

  const searchedProducts =
    searchQuery && searchQuery.trim().length > 0
      ? filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
        )
      : filteredProducts;

  async function handleAddToCart(productId, product) {
    if (isAuthenticated) {
      await addToCart(productId, 1);
    } else {

      let prod = product;
      if (!prod || !prod.name) {
        prod = allProducts.find((p) => p.id === productId);
      }
      if (!prod || !prod.name) {
        prod = await getProductById(productId);
      }
      localAddToCart(prod, 1);
    }
    if (onCartUpdated) onCartUpdated();
  }

  if (loading) {
    return (
      <div className="product-grid">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {error && <p className="products-note">{error}</p>}
      {searchedProducts.length === 0 ? (
        <p className="products-note">No products found in this category yet.</p>
      ) : (
        <div className="product-grid">
          {searchedProducts.slice(0, 30).map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              onAddToCart={(id) => handleAddToCart(id, product)}
            />
          ))}
        </div>
      )}
    </>
  );
}
