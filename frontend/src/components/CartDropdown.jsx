import "../styles/CartDropdown.css";
import { Link } from "react-router-dom";

export default function CartDropdown({ cart, onUpdateQty, onRemove }) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <div className="cart-dropdown">
      <h4>Cart Items</h4>
      {cart.items.length === 0 ? (
        <div className="cart-empty">Your cart is empty.</div>
      ) : (
        <ul className="cart-list">
          {cart.items.map((item) => (
            <li key={item.id} className="cart-list-item">
              <Link to={`/product/${item.product_id}`}>{item.name}</Link>
              <div className="cart-qty-row">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => onUpdateQty(item.id, Number(e.target.value))}
                />
                <button onClick={() => onRemove(item.id)}>Remove</button>
              </div>
              <span className="cart-item-price">
                ₹{item.price * item.quantity}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-summary-row">
        <span>Subtotal:</span>
        <span>₹{subtotal}</span>
      </div>
      <Link to="/cart" className="cart-viewall-btn">
        View all
      </Link>
    </div>
  );
}
