import Banner from "../components/Banner";
import HomeGrids from "../components/HomeGrids";
import FeaturedRows from "../components/FeaturedRows";
import ProductGrid from "../components/ProductGrid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import { mockProducts } from "../data/mockCatalog";

function normalizeCategory(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function HomePage({
  selectedCategory,
  searchQuery,
  onCartUpdated,
}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedProducts() {
      try {
        const rows = await getProducts();
        if (!mounted) return;

        const normalized = (Array.isArray(rows) ? rows : []).map((item) => ({
          ...item,
          categoryKey: item.category_key || normalizeCategory(item.category),
        }));

        setFeaturedProducts(normalized.length > 0 ? normalized : mockProducts);
      } catch {
        if (!mounted) return;
        setFeaturedProducts(mockProducts);
      }
    }

    loadFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const heading =
    selectedCategory === "all"
      ? "Featured Products"
      : `Featured Products - ${selectedCategory.replace(/_/g, " ").toUpperCase()}`;

  return (
    <div className="homepage-bg">
      <Banner />

      <div className="homepage-content">
        <HomeGrids />

        <div className="container">
          <FeaturedRows
            selectedCategory={selectedCategory}
            products={featuredProducts}
          />

          <h2 className="section-heading">{heading}</h2>
          <ProductGrid
            category={selectedCategory}
            searchQuery={searchQuery}
            onCartUpdated={onCartUpdated}
          />
        </div>
      </div>
    </div>
  );
}
