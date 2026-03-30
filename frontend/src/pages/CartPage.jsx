import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeCartItem, updateCartItem, addToWishlist } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/CartPage.css";
import { FALLBACK_PRODUCT_IMAGE, handleImageError } from "../utils/imageFallback";
import {
  localGetCart,
  localRemoveCartItem,
  localUpdateCartItem,
  localAddToWishlist,
} from "../utils/localCart";

export default function CartPage({ onCartUpdated }) {
  const [cartData, setCartData] = useState({ items: [], summary: { item_count: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [inlineMsg, setInlineMsg] = useState(null);

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    setTimeout(() => setInlineMsg(null), 3500);
  }

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const data = await getCart();
        setCartData(data);
      } else {
        const data = localGetCart();
        setCartData(data);
      }
      setError(null);
    } catch (err) {

      const data = localGetCart();
      setCartData(data);
      if (data.items.length === 0) {
        setError("Unable to load cart. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated]);

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    
    // Optimistic Update: Update UI immediately
    const previousCartData = { ...cartData };
    const updatedItems = cartData.items.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    );
    setCartData({ ...cartData, items: updatedItems });

    try {
      const numericQty = Number(newQty);
      if (isAuthenticated) {
        await updateCartItem(itemId, numericQty);
      } else {
        localUpdateCartItem(itemId, numericQty);
      }
      
      const data = isAuthenticated ? await getCart() : localGetCart();
      setCartData(data);
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error("Cart Update Failed:", err.response?.data || err.message);
      setCartData(previousCartData);
      showInline(err.response?.data?.error || "Failed to sync cart update with server.", "error");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      if (isAuthenticated) {
        await removeCartItem(itemId);
      } else {
        localRemoveCartItem(itemId);
      }
      showInline("Item removed from cart");
      fetchCartItems();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      showInline("Failed to remove item", "error");
    }
  };

  const handleMoveToWishlist = async (item) => {
    try {
      if (isAuthenticated) {
        await addToWishlist(item.product_id);
        await removeCartItem(item.id);
      } else {
        localAddToWishlist({
          id: item.product_id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
        });
        localRemoveCartItem(item.id);
      }
      showInline(`${item.name} moved to Wish List`);
      fetchCartItems();
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      showInline("Failed to move to wishlist", "error");
    }
  };

  const subtotal = cartData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartData.items.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <div className="cart-page loading">Loading your cart...</div>;

  return (
    <main className="cart-page">
      <div className="cart-container">
        {}
        <section className="cart-main">
          <h1>Shopping Cart</h1>
          <p className="cart-price-header">Price</p>
          <hr />

          {}
          {inlineMsg && (
            <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
              <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
              {inlineMsg.text}
            </div>
          )}

          {cartData.items.length === 0 ? (
            <div className="empty-cart">
              <h2>Your Amazon Cart is empty.</h2>
              <p>Check your Saved for Later items below or <Link to="/">continue shopping</Link>.</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartData.items.map((item) => (
                <article key={item.id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.image_url || FALLBACK_PRODUCT_IMAGE}
                      alt={item.name}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-header">
                        <Link to={`/product/${item.product_id}`} className="item-name">
                        {item.name}
                      </Link>
                      <span className="item-price">₹{Number(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="item-stock">In stock</p>
                    <p className="item-shipping">Eligible for FREE Shipping</p>
                    <p className="item-unit-price" style={{fontSize: "12px", color: "#565959"}}>₹{Number(item.price).toLocaleString("en-IN")} each</p>

                    <div className="item-actions">
                      <div className="qty-selector-wrap">
                        <button className="qty-btn minus" onClick={() => handleUpdateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                        <div className="qty-select-container">
                          <select
                            value={item.quantity}
                            onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                            className="qty-select-inner"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25].map((num) => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                          <span className="qty-display-text">Qty: {item.quantity}</span>
                        </div>
                        <button className="qty-btn plus" onClick={() => handleUpdateQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="action-divider">|</span>
                      <button className="btn-delete-icon" onClick={() => handleDelete(item.id)} title="Remove item">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        <span>Delete</span>
                      </button>
                      <span className="action-divider">|</span>
                      <button className="btn-link" onClick={() => handleMoveToWishlist(item)}>Add to Wishlist</button>
                      <span className="action-divider">|</span>
                      <button className="btn-link">See more like this</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {cartData.items.length > 0 && (
            <div className="cart-footer">
              <span className="subtotal-text">
                Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}):
                <strong> ₹{subtotal.toLocaleString("en-IN")}</strong>
              </span>
            </div>
          )}
        </section>

        {}
        {cartData.items.length > 0 && (
          <aside className="cart-sidebar">
            <div className="checkout-card">
              <div className="free-delivery-badge">
                <span className="check-icon">✓</span>
                <span>Your order is eligible for FREE Delivery. Select this option at checkout.</span>
              </div>
              <p className="sidebar-subtotal">
                Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}):
                <strong> ₹{subtotal.toLocaleString("en-IN")}</strong>
              </p>
              <div className="gift-checkbox">
                <input type="checkbox" id="is-gift" />
                <label htmlFor="is-gift">This order contains a gift</label>
              </div>
              <button
                className="btn-proceed"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: { pathname: "/cart" } } });
                  } else {
                    navigate("/checkout");
                  }
                }}
              >
                Proceed to Buy ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </button>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
