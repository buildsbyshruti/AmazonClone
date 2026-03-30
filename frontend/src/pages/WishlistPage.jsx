import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist, addToCart } from "../services/api";
import "../styles/WishlistPage.css";
import { FALLBACK_PRODUCT_IMAGE, handleImageError } from "../utils/imageFallback";
import { useAuth } from "../context/AuthContext";
import {
  localGetWishlist,
  localRemoveFromWishlist,
  localAddToCart,
} from "../utils/localCart";

export default function WishlistPage({ onCartUpdated }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const [inlineMsg, setInlineMsg] = useState(null);

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    setTimeout(() => setInlineMsg(null), 3500);
  }

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const data = await getWishlist();
        setItems(data);
      } else {
        setItems(localGetWishlist());
      }
      setError(null);
    } catch (err) {

      setItems(localGetWishlist());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      if (isAuthenticated) {
        await removeFromWishlist(productId);
      } else {
        localRemoveFromWishlist(productId);
      }
      showInline("Item removed from wishlist");
      fetchWishlist();
    } catch (err) {
      showInline("Failed to remove item", "error");
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      if (isAuthenticated) {
        await addToCart(product.product_id, 1);
        await removeFromWishlist(product.product_id);
      } else {
        localAddToCart(
          {
            id: product.product_id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
          },
          1,
        );
        localRemoveFromWishlist(product.product_id);
      }
      showInline(`${product.name} moved to cart!`);
      fetchWishlist();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      showInline("Failed to move to cart", "error");
    }
  };

  if (loading) return <div className="wishlist-page loading">Loading wishlist...</div>;

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <header className="wishlist-header">
          <h1>Your Wish List</h1>
          <div className="list-meta">
            <span>Public</span>
            <span className="divider">|</span>
            <button className="btn-link">Send list to others</button>
          </div>
        </header>

        {}
        {inlineMsg && (
          <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
            <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
            {inlineMsg.text}
          </div>
        )}

        <section className="wishlist-content">
          {items.length === 0 ? (
            <div className="empty-wishlist">
              <p>You haven't added anything to your wish list yet. <Link to="/">Start shopping</Link>.</p>
            </div>
          ) : (
            <div className="wishlist-grid">
              {items.map((item) => (
                <article key={item.id} className="wishlist-item">
                  <div className="wishlist-item-main">
                    <Link to={`/product/${item.product_id}`} className="item-image-link">
                      <img
                        src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                        alt={item.name}
                        onError={handleImageError}
                      />
                    </Link>
                    <div className="item-details">
                      <Link to={`/product/${item.product_id}`} className="item-name">
                        {item.name}
                      </Link>
                      <div className="item-rating">
                        <span className="stars">★★★★★</span>
                      </div>
                      <div className="item-price">
                        <span className="currency">₹</span>
                        <span className="whole">{Math.floor(item.price).toLocaleString("en-IN")}</span>
                      </div>
                      <p className="item-date">Added October 11, 2024</p>
                    </div>
                  </div>

                  <div className="wishlist-item-actions">
                    <button
                      className="btn-add-cart"
                      onClick={() => handleMoveToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
