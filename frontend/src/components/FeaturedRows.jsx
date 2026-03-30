import "../styles/FeaturedRows.css";
import { featuredRows } from "../data/mockCatalog";
import { Link } from "react-router-dom";
import {
  FALLBACK_PRODUCT_IMAGE,
  handleImageError,
} from "../utils/imageFallback";

function uniqueById(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getRowProducts(row, selectedCategory, products = []) {
  const source = Array.isArray(products) && products.length > 0 ? products : [];

  let rowProducts = source.filter((product) =>
    row.categoryKeys.includes(product.categoryKey),
  );

  if (rowProducts.length < 10) {
    const extra = source.filter(p => !rowProducts.find(rp => rp.id === p.id)).slice(0, 15 - rowProducts.length);
    rowProducts = [...rowProducts, ...extra];
  }

  if (selectedCategory && selectedCategory !== "all") {
    const selectedProducts = source.filter(
      (product) => product.categoryKey === selectedCategory,
    );

    if (row.categoryKeys.includes(selectedCategory)) {
      return uniqueById([...selectedProducts, ...rowProducts]).slice(0, 16);
    }
    return rowProducts.length > 0
      ? rowProducts.slice(0, 16)
      : selectedProducts.slice(0, 16);
  }

  return rowProducts.slice(0, 12);
}

export default function FeaturedRows({ selectedCategory, products }) {
  const rows = featuredRows
    .slice(0, 2)
    .map((row) => ({
      ...row,
      products: getRowProducts(row, selectedCategory, products),
    }))
    .filter((row) => row.products.length > 0);

  return (
    <div className="featured-rows-wrapper">
      {rows.map((row, index) => (
        <section key={row.id} className={`featured-row-section ${index === 0 ? 'multi-row-grid' : ''}`}>
          <div className="featured-row-header">
            <h2>{row.title}</h2>
            <Link
              to={`/category/${row.categoryKeys[0]}`}
              aria-label={`${row.title} see all`}
            >
              See all
            </Link>
          </div>

          <div className="featured-row-track" role="list">
            {row.products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={`${row.id}-${product.id}`}
                className="featured-item"
                role="listitem"
              >
                <div className="featured-image-wrap">
                  <img
                    src={product.image_url || FALLBACK_PRODUCT_IMAGE}
                    alt={product.name}
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
                <p className="featured-name">{product.name}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
