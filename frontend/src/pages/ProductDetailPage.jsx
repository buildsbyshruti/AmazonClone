import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCart, getProductById, getProducts } from "../services/api";
import "../styles/ProductDetailPage.css";
import {
  FALLBACK_PRODUCT_IMAGE,
  handleImageError,
} from "../utils/imageFallback";
import { useAuth } from "../context/AuthContext";
import { addToWishlist as apiAddToWishlist } from "../services/api";
import { localAddToCart, localAddToWishlist } from "../utils/localCart";

function normalizeCategory(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildStarText(rating) {
  const safeRating = Number(rating) || 0;
  const filled = Math.max(0, Math.min(5, Math.round(safeRating)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

function estimatedDeliveryText() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

import { mockProducts } from "../data/mockCatalog";

export default function ProductDetailPage({ onCartUpdated }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [procMsg, setProcMsg] = useState("Processing your order...");
  const { isAuthenticated } = useAuth();
  const [showFullViewModal, setShowFullViewModal] = useState(false);

  const [inlineMsg, setInlineMsg] = useState(null);

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    setTimeout(() => setInlineMsg(null), 3500);
  }

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        let data = mockProducts.find(p => String(p.id) === String(productId));
        let allProducts = mockProducts;

        try {
          const [apiProduct, apiAll] = await Promise.all([
            getProductById(productId),
            getProducts(),
          ]);
          if (apiProduct) data = apiProduct;
          if (Array.isArray(apiAll) && apiAll.length > 0) allProducts = apiAll;
        } catch (apiErr) {

          console.info("API unavailable, using mock catalog.");
        }

        if (!mounted) return;

        if (!data) {
          setError("Product not found in our catalog.");
          setLoading(false);
          return;
        }

        const currentCategory =
          data.category_key || data.categoryKey || normalizeCategory(data.category);
        const related = (Array.isArray(allProducts) ? allProducts : [])
          .filter((item) => {
            const itemCategory =
              item.category_key || item.categoryKey || normalizeCategory(item.category);
            return item.id !== data.id && itemCategory === currentCategory;
          })
          .slice(0, 4);

        setProduct(data);
        setRelatedProducts(related);
        setQuantity(1);
        setActiveImageIndex(0);
        setError("");
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.data?.error || "Unable to load product details",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map((item) => item.image_url).filter(Boolean);
    }
    return [product.image_url].filter(Boolean);
  }, [product]);

  const activeImage = images[activeImageIndex] || FALLBACK_PRODUCT_IMAGE;
  const safeRating = Number(product?.rating) || 4.0;
  const reviewCount = Number(product?.reviews || product?.reviews_count || 0);
  const discount = Number(product?.discount || 0);
  const price = Number(product?.price || 0);
  const mrp =
    discount > 0 ? Math.round((price * 100) / (100 - discount)) : price;
  const savedAmount = Math.max(0, mrp - price);
  const stockCount = Math.max(0, Number(product?.stock || 0));

  const productHighlights = useMemo(() => {
    if (
      Array.isArray(product?.specifications) &&
      product.specifications.length > 0
    ) {
      return product.specifications.slice(0, 5).map((spec) => {
        return `${spec.spec_key}: ${spec.spec_value}`;
      });
    }

    return [
      "Quality-tested and durable product build for everyday use.",
      "Designed for easy setup and reliable performance.",
      "Carefully packaged and fulfilled by trusted sellers.",
      "Simple returns and customer support available.",
    ];
  }, [product]);

  const boughtTogether = useMemo(() => {
    if (!product) return [];
    return [product, ...relatedProducts.slice(0, 1)];
  }, [product, relatedProducts]);

  const boughtTogetherTotal = useMemo(() => {
    return boughtTogether.reduce(
      (total, item) => total + (Number(item.price) || 0),
      0,
    );
  }, [boughtTogether]);

  async function handleAddToCart(customQty = quantity) {
    if (!product) return;
    if (stockCount <= 0) {
      showInline("We're temporarily out of stock on this item. Please check back later.", "error");
      return;
    }

    try {
      if (isAuthenticated) {
        await addToCart(product.id, Number(customQty) || 1);
      } else {
        localAddToCart(product, Number(customQty) || 1);
      }
      showInline(`${product.name} added to cart!`);
      onCartUpdated();
    } catch (err) {
      showInline(err?.response?.data?.error || "Failed to add item", "error");
    }
  }

  async function handleAddSpecificProduct(productToAdd, customQty = 1) {
    try {
      if (isAuthenticated) {
        await addToCart(productToAdd.id, Number(customQty) || 1);
      } else {
        localAddToCart(productToAdd, Number(customQty) || 1);
      }
      showInline("Item added to cart!");
      onCartUpdated();
    } catch (err) {
      showInline("Failed to add item", "error");
    }
  }

  async function handleWishlist() {
    if (!product) return;
    try {
      if (isAuthenticated) {
        await apiAddToWishlist(product.id);
      } else {
        localAddToWishlist(product);
      }
      showInline(`${product.name} added to your Wish List!`);
    } catch (err) {
      showInline("Failed to add to wishlist", "error");
    }
  }

  async function handleBuyNow() {
    if (stockCount <= 0) {
      showInline("We're temporarily out of stock on this item. Please check back later.", "error");
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }

    // Logic: Navigate to checkout with this specific item as "directItems"
    // This bypasses the need to add to the permanent cart.
    const directItems = [{
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image_url: product.image_url
    }];

    navigate("/checkout", { state: { directItems } });
  }

  if (loading) {
    return (
      <main className="container product-detail-page">
        Loading product details...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container product-detail-page">
        {error || "Product not found"}
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      {placing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="amazon-spinner"></div>
            <h2>{procMsg}</h2>
            <p>Please do not refresh or close this page.</p>
          </div>
        </div>
      )}
      <div className="breadcrumb-container">
        <Link to="/">Home</Link>
        <span> &rsaquo; </span>
        <Link to={`/category/${normalizeCategory(product.category)}`}>{product.category}</Link>
        <span> &rsaquo; </span>
        <span className="current-crumb">{product.name}</span>
      </div>

      <section className="product-detail-layout amazon-product-layout">
        <div className="product-gallery">
          <div className="main-image-row">
            <div className="main-image-wrap">
              <img
                src={activeImage}
                alt={product.name}
                className="main-image"
                onError={handleImageError}
              />
            </div>
            <button 
              type="button"
              className="full-view-link"
              onClick={() => setShowFullViewModal(true)}
            >
              Click to see full view
            </button>
          </div>

          <div className="thumbnail-list">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`thumbnail ${activeImageIndex === index ? "active" : ""}`}
                onClick={() => setActiveImageIndex(index)}
                onMouseEnter={() => setActiveImageIndex(index)}
              >
                <img
                  src={image || FALLBACK_PRODUCT_IMAGE}
                  alt={`${product.name} ${index + 1}`}
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-meta amazon-detail-main">
          <h1>{product.name}</h1>
          <p className="meta-link">Visit the {product.category} Store</p>

          <div className="meta-rating-line">
            <span>{safeRating.toFixed(1)}</span>
            <span className="stars-text">{buildStarText(safeRating)}</span>
            <span className="meta-link">({reviewCount}) ratings</span>
          </div>

          <hr />

          <div className="meta-price-block">
            {discount > 0 && (
              <span className="meta-save-tag">-{discount}%</span>
            )}
            <span className="meta-price">{formatCurrency(price)}</span>
          </div>

          {discount > 0 && (
            <p className="meta-mrp">
              M.R.P.: <span>{formatCurrency(mrp)}</span> | You save{" "}
              {formatCurrency(savedAmount)}
            </p>
          )}

          <p className="meta-tax">Inclusive of all taxes</p>

          <div className="meta-offers-badges">
            <div className="badge-item">
              <div className="badge-icon-wrap">
                <svg viewBox="0 0 48 48" width="35" height="35">
                  <path fill="#007185" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20s20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16s-7.18 16-16 16zm-1-26h2v10.59l8.71 5.12l-1.02 1.73l-9.69-5.73V14z"/>
                </svg>
              </div>
              <span>7 days Replacement</span>
            </div>
            <div className="badge-item">
              <div className="badge-icon-wrap">
                <svg viewBox="0 0 48 48" width="35" height="35">
                  <path fill="#007185" d="M40 16h-6V8c0-2.2-1.8-4-4-4H8C5.8 4 4 5.8 4 8v24c0 2.2 1.8 4 4 4h4c0 3.3 2.7 6 6 6s6-2.7 6-6h12c0 3.3 2.7 6 6 6s6-2.7 6-6h2v-8l-6-12zM18 38c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zm24-2c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2zM32.3 20H37l3.2 6.4V32h-7.9v-12z"/>
                </svg>
              </div>
              <span>Free Delivery</span>
            </div>
            <div className="badge-item">
              <div className="badge-icon-wrap">
                <svg viewBox="0 0 48 48" width="35" height="35">
                  <path fill="#007185" d="M24 2L6 10v12c0 11.1 7.7 21.5 18 24c10.3-2.5 18-12.9 18-24V10L24 2zm0 37.8c-7.9-2.1-14-10.4-14-18.8V12.4l14-6.2l14 6.2v8.6c0 8.4-6.1 16.7-14 18.8z"/>
                  <path fill="#007185" d="M24 14c-4.4 0-8 3.6-8 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8zm0 13c-2.8 0-5-2.2-5-5s2.2-5 5-5s5 2.2 5 5s-2.2 5-5 5z"/>
                </svg>
              </div>
              <span>1 Year Warranty</span>
            </div>
            <div className="badge-item">
              <div className="badge-icon-wrap">
                <svg viewBox="0 0 48 48" width="35" height="35">
                  <path fill="#007185" d="M38 10L30.6 2l-7.4 8L15.8 2L8.4 10l-6.4 7L12 24l-10 7l6.4 7l7.4 8l7.4-8l7.4 8l7.4-8l6.4-7l-10-7l10-7l-6.4-7zM24 33.2L14.8 38l1.8-10.3l-7.5-7.3l10.4-1.5L24 9.5l4.6 9.4l10.4 1.5l-7.5 7.3l1.8 10.3l-9.3-4.8z"/>
                </svg>
              </div>
              <span>Top Brand</span>
            </div>
          </div>

          <hr />

          <p className="meta-delivery-line">
            FREE delivery <strong>{estimatedDeliveryText()}</strong>
          </p>

          <div className="offer-strip">
            <h3>Offers</h3>
            <div className="offer-cards">
              <article>
                <h4>Cashback</h4>
                <p>
                  Up to {formatCurrency(Math.round(price * 0.1))} cashback on
                  select methods.
                </p>
              </article>
              <article>
                <h4>Bank Offer</h4>
                <p>10% instant discount on partner bank cards.</p>
              </article>
              <article>
                <h4>Partner Offer</h4>
                <p>Save extra with combined purchases from this category.</p>
              </article>
            </div>
          </div>

          <section className="meta-about">
            <h3>About this item</h3>
            <ul>
              {productHighlights.map((highlight, index) => (
                <li key={`${highlight}-${index}`}>{highlight}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="purchase-box">
          <p className="purchase-delivery">
            FREE delivery <strong>{estimatedDeliveryText()}</strong>
          </p>
          <p
            className={`stock-status ${stockCount > 0 ? "in-stock" : "out-of-stock"}`}
          >
            {stockCount > 0 ? "In stock" : "Out of stock"}
          </p>

          <label className="qty-label" htmlFor="purchase-qty">
            Quantity
          </label>
          <select
            id="purchase-qty"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            disabled={stockCount <= 0}
          >
            {Array.from({ length: Math.min(10, Math.max(stockCount, 1)) }).map(
              (_, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {idx + 1}
                </option>
              ),
            )}
          </select>

          {}
          {inlineMsg && (
            <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
              <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
              {inlineMsg.text}
            </div>
          )}

          <div className="detail-actions">
            <button
              type="button"
              className="btn-cart"
              onClick={() => handleAddToCart(quantity)}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="btn-buy"
              onClick={() => handleBuyNow()}
            >
              Buy Now
            </button>
          </div>

          <div className="purchase-meta">
            <div className="meta-row">
              <span className="meta-label">Ships from</span>
              <span className="meta-val link">Amazon</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Sold by</span>
              <span className="meta-val link">Appario Retail Private Ltd</span>
            </div>
          </div>

          <div className="buybox-security">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#999"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
            <span>Secure transaction</span>
          </div>

          <button className="btn-wishlist" onClick={handleWishlist}>Add to Wish List</button>
        </aside>
      </section>

      <section className="specs-card product-extra-card">
        <h2>Product specifications</h2>
        {Array.isArray(product.specifications) &&
        product.specifications.length > 0 ? (
          <ul>
            {product.specifications.map((spec, index) => (
              <li key={`${spec.spec_key}-${index}`}>
                <span>{spec.spec_key}</span>
                <strong>{spec.spec_value}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No technical specifications available.</p>
        )}
      </section>

      {boughtTogether.length > 1 && (
        <section className="specs-card product-extra-card">
          <h2>Products customers bought together</h2>
          <div className="bought-together">
            {boughtTogether.map((item) => (
              <article key={item.id} className="bought-item">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                    alt={item.name}
                    onError={handleImageError}
                  />
                </Link>
                <Link to={`/product/${item.id}`} className="bought-name">
                  {item.name}
                </Link>
                <p>{formatCurrency(item.price)}</p>
              </article>
            ))}
          </div>
          <div className="bought-footer">
            <p>
              Total price:{" "}
              <strong>{formatCurrency(boughtTogetherTotal)}</strong>
            </p>
            <button
              type="button"
              className="btn-cart"
              onClick={async () => {
                for (const item of boughtTogether) {

                  await handleAddSpecificProduct(
                    item,
                    item.id === product.id ? quantity : 1,
                  );
                }
              }}
            >
              Add both to Cart
            </button>
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="specs-card product-extra-card">
          <h2>Similar products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="related-product-card"
              >
                <img
                  src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                  alt={item.name}
                  onError={handleImageError}
                />
                <p>{item.name}</p>
                <strong>{formatCurrency(item.price)}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="specs-card customer-reviews-section">
        <div className="reviews-layout">
          <div className="reviews-summary">
            <h2>Customer reviews</h2>
            <div className="summary-rating">
              <span className="stars-text">{buildStarText(safeRating)}</span>
              <span className="rating-out-of">{safeRating.toFixed(1)} out of 5</span>
            </div>
            <p className="total-ratings-text">{reviewCount.toLocaleString()} global ratings</p>

            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const perc = star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 5 : 2;
                return (
                  <div key={star} className="rating-bar-row">
                    <span>{star} star</span>
                    <div className="bar-bg">
                      <div className="bar-fill" style={{ width: `${perc}%` }}></div>
                    </div>
                    <span className="bar-perc">{perc}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="reviews-list">
            <h3>Top reviews from India</h3>
            <article className="review-item">
              <div className="user-profile">
                <div className="user-icon"></div>
                <span className="user-name">Abhishek Kumar</span>
              </div>
              <div className="review-header">
                <span className="stars-text">★★★★★</span>
                <strong>Verified Purchase</strong>
              </div>
              <p className="review-title">Excellent performance and value!</p>
              <p className="review-date">Reviewed in India on 24 March 2024</p>
              <div className="review-body">
                Really impressed with the build quality and the features offered at this price point. Highly recommended for everyone.
              </div>
            </article>
          </div>
        </div>
      </section>

      {showFullViewModal && (
        <div className="full-view-overlay" onClick={() => setShowFullViewModal(false)}>
          <div className="full-view-content" onClick={(e) => e.stopPropagation()}>
            <button className="full-view-close" onClick={() => setShowFullViewModal(false)} aria-label="Close full view">&times;</button>
            <div className="full-view-image-container">
               <img src={activeImage} alt={product.name} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
