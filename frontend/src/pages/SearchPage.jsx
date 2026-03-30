import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/CategoryPage.css";
import { mockProducts } from "../data/mockCatalog";
import { FALLBACK_PRODUCT_IMAGE, handleImageError } from "../utils/imageFallback";
import { getProducts } from "../services/api";

function normalizeCategory(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function SearchPage({ onCartUpdated }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryKey = searchParams.get("category") || "all";
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        setLoading(true);
        const apiRows = await getProducts();
        if (!mounted) return;

        const normalizedApi = (Array.isArray(apiRows) ? apiRows : []).map(p => ({
          ...p,
          categoryKey: p.category_key || normalizeCategory(p.category)
        }));

        const merged = [...normalizedApi];
        mockProducts.forEach(mp => {
           if (!merged.find(ap => ap.name === mp.name)) {
             merged.push(mp);
           }
        });
        setAllProducts(merged);
      } catch (err) {
        setAllProducts(mockProducts);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    setPriceRange(null);
    setMinRating(0);
    setMinDiscount(0);
    window.scrollTo(0, 0);
    init();

    return () => { mounted = false; };
  }, [query, categoryKey]);

  const filteredProducts = useMemo(() => {
    if (loading) return [];
    return allProducts.filter(p => {

      if (categoryKey && categoryKey !== "all" && p.categoryKey !== categoryKey) return false;

      const nameMatch = p.name?.toLowerCase().includes(query.toLowerCase());
      const catMatch = p.category?.toLowerCase().includes(query.toLowerCase());
      if (query && !nameMatch && !catMatch) return false;

      const effectivePrice = Math.floor(p.price * (1 - (p.discount || 0) / 100));
      if (priceRange) {
        if (priceRange.max && effectivePrice > priceRange.max) return false;
        if (priceRange.min && effectivePrice < priceRange.min) return false;
      }

      const prating = p.rating || 4.2;
      if (prating < minRating) return false;

      if ((p.discount || 0) < minDiscount) return false;

      return true;
    });
  }, [query, categoryKey, priceRange, minRating, minDiscount]);

  const clearFilters = () => {
    setPriceRange(null);
    setMinRating(0);
    setMinDiscount(0);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <p className="results-count">
          1-{filteredProducts.length} results for <span className="category-highlight">"{query || categoryKey}"</span>
          {(priceRange || minRating > 0 || minDiscount > 0) && (
            <button className="clear-filter-btn" onClick={clearFilters}>Clear filters</button>
          )}
        </p>
      </div>

      <div className="category-container">
        {}
        <aside className="category-sidebar">

          <div className="filter-group">
            <h3>Customer Reviews</h3>
            {[4, 3, 2, 1].map(r => (
              <div
                key={r}
                className={`rating-filter ${minRating === r ? 'active-filter' : ''}`}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
              >
                <span className="stars">
                  {"★".repeat(r)}{"☆".repeat(5-r)}
                </span> & Up
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h3>Price</h3>
            <ul>
              <li onClick={() => setPriceRange({ max: 500 })} className={priceRange?.max === 500 ? 'active-filter' : ''}>Under ₹500</li>
              <li onClick={() => setPriceRange({ min: 500, max: 1000 })} className={priceRange?.min === 500 ? 'active-filter' : ''}>₹500 - ₹1,000</li>
              <li onClick={() => setPriceRange({ min: 1000, max: 2000 })} className={priceRange?.min === 1000 ? 'active-filter' : ''}>₹1,000 - ₹2,000</li>
              <li onClick={() => setPriceRange({ min: 2000, max: 5000 })} className={priceRange?.min === 2000 ? 'active-filter' : ''}>₹2,000 - ₹5,000</li>
              <li onClick={() => setPriceRange({ min: 5000 })} className={priceRange?.min === 5000 ? 'active-filter' : ''}>Over ₹5,000</li>
            </ul>
            <form className="price-custom" onSubmit={(e) => {
              e.preventDefault();
              const min = parseInt(e.target.min.value) || 0;
              const max = parseInt(e.target.max.value) || Infinity;
              setPriceRange({ min, max });
            }}>
              <input type="number" name="min" placeholder="Min" />
              <input type="number" name="max" placeholder="Max" />
              <button type="submit">Go</button>
            </form>
          </div>

          <div className="filter-group">
            <h3>Deals & Discounts</h3>
            <ul>
              <li onClick={() => setMinDiscount(0)} className={minDiscount === 0 ? 'active-filter' : ''}>All Deals</li>
              <li onClick={() => setMinDiscount(10)} className={minDiscount === 10 ? 'active-filter' : ''}>10% Off or more</li>
              <li onClick={() => setMinDiscount(25)} className={minDiscount === 25 ? 'active-filter' : ''}>25% Off or more</li>
              <li onClick={() => setMinDiscount(35)} className={minDiscount === 35 ? 'active-filter' : ''}>35% Off or more</li>
              <li onClick={() => setMinDiscount(50)} className={minDiscount === 50 ? 'active-filter' : ''}>50% Off or more</li>
            </ul>
          </div>

        </aside>

        {}
        <main className="category-main">
          <div className="category-results-meta">
            <h2>Results</h2>
            <div className="mobile-filter-bar">
               <button className="filter-chip" onClick={() => setMinRating(4)}>4★ & Up</button>
               <button className="filter-chip" onClick={() => setPriceRange({ max: 1000 })}>Under ₹1000</button>
               <button className="filter-chip" onClick={() => { clearFilters(); }}>Clear All Filters</button>
            </div>
          </div>
          <div className="product-list-row">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="search-result-card skeleton-card">
                  <div className="product-image-box skeleton-img"></div>
                  <div className="product-info-box">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line title short"></div>
                    <div className="skeleton-line rating"></div>
                    <div className="skeleton-line price"></div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="search-result-card">
                  <Link to={`/product/${product.id}`} className="product-image-box">
                    <img
                      src={product.image_url || FALLBACK_PRODUCT_IMAGE}
                      alt={product.name}
                      onError={handleImageError}
                    />
                  </Link>
                  <div className="product-info-box">
                    <Link to={`/product/${product.id}`} className="product-title">
                      {product.name}
                    </Link>
                    <div className="product-rating">
                      <span className="stars">
                        {"★".repeat(Math.round(product.rating || 4))}{"☆".repeat(5-Math.round(product.rating || 4))}
                      </span>
                      <span className="review-count">{product.reviews || 0}</span>
                    </div>
                    <div className="product-price-row">
                      <span className="price-symbol">₹</span>
                      <span className="price-whole">{Math.floor(product.price * (1 - (product.discount || 0) / 100))}</span>
                      <span className="price-mrp">M.R.P: <span>₹{product.price}</span></span>
                    </div>
                    <p className="delivery-info">FREE delivery by <b>Tomorrow, 11 AM</b></p>
                    <p className="prime-badge"><span>prime</span></p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-box-professional">
                <div className="no-results-content">
                  <div className="no-results-icon">!</div>
                  <div className="no-results-text">
                    <h3>No results found for "{query || categoryKey}" with current filters.</h3>
                    <p>Try checking your spelling or use more general terms.</p>
                    <ul>
                      <li>Check for typos or spelling errors</li>
                      <li>Try clearing some filters (Price, Rating)</li>
                      <li>Search for a broader term</li>
                    </ul>
                    <button className="amazon-btn-yellow" onClick={clearFilters}>Clear All Filters</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
