import { useState } from "react";
import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
import {
  FALLBACK_PRODUCT_IMAGE,
  handleImageError,
} from "../utils/imageFallback";
import { useAuth } from "../context/AuthContext";
import { addToWishlist } from "../services/api";
import { localAddToWishlist } from "../utils/localCart";

export default function ProductCard({ product, onAddToCart }) {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState(null);

  function showInlineMsg(text, type = "success") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleAdd(event) {
    event.preventDefault();
    event.stopPropagation();
    if (Number(product.stock) <= 0) {
      showInlineMsg("We're temporarily out of stock on this item.", "error");
      return;
    }
    if (onAddToCart) {
      try {
        await onAddToCart(product.id, product);
        showInlineMsg(`${product.name} added to cart!`);
      } catch {
        showInlineMsg("Failed to add to cart", "error");
      }
    }
  }

  async function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (isAuthenticated) {
        await addToWishlist(product.id);
      } else {
        localAddToWishlist(product);
      }
      showInlineMsg(`${product.name} added to Wish List!`);
    } catch (err) {
      showInlineMsg("Failed to add to wishlist", "error");
    }
  }

  const mainPrice = Math.floor(product.price);
  const decimalPrice = (product.price % 1).toFixed(2).split(".")[1] || "00";
  const mrp = product.discount > 0 ? Math.round((product.price * 100) / (100 - product.discount)) : null;

  return (
    <Link to={`/product/${product.id}`} className="product-card amazon-style-card">
      <div className="product-image-container">
        <img
          src={product.image_url || FALLBACK_PRODUCT_IMAGE}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
        {product.discount >= 50 && <span className="best-seller-badge">Best Seller</span>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="rating-row">
          <div className="stars-visual">
            <span className="stars-yellow">★★★★☆</span>
            <span className="rating-count">{product.reviews || 0}</span>
          </div>
        </div>

        <div className="pricing-block">
          {product.discount > 0 && (
            <div className="deal-badge">Limited time deal</div>
          )}
          <div className="main-price-row">
            <span className="currency-symbol">₹</span>
            <span className="price-whole">{mainPrice.toLocaleString("en-IN")}</span>
            <span className="price-decimal">{decimalPrice === "00" ? "" : decimalPrice}</span>
          </div>
          {mrp && (
            <div className="mrp-row">
              M.R.P: <span className="mrp-value">₹{mrp.toLocaleString("en-IN")}</span>
              <span className="discount-perc">({product.discount}% off)</span>
            </div>
          )}
        </div>

        <div className="delivery-row">
          <span className="delivery-text">Get it by </span>
          <span className="delivery-date">Tomorrow, Oct 12</span>
          <span className="delivery-type">FREE Delivery by Amazon</span>
        </div>

        {message && (
          <div className={`inline-msg inline-msg--${message.type}`}>
            <span className="inline-msg-icon">{message.type === "success" ? "✓" : "!"}</span>
            {message.text}
          </div>
        )}

        <div className="cart-action-row">
          <button className="amazon-add-btn" onClick={handleAdd}>
            Add to Cart
          </button>
          <button className="amazon-wish-icon-btn" onClick={handleWishlist} title="Add to Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
