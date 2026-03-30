import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getOrders, addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/OrderHistoryPage.css";

export default function OrderHistoryPage({ onCartUpdated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [inlineMsg, setInlineMsg] = useState(null);

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    setTimeout(() => setInlineMsg(null), 3500);
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("3months");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setOrders([
        {
          id: "DEMO-832914",
          created_at: new Date().toISOString(),
          total_amount: 5499.00,
          user_name: "Guest User",
          status: "Delivered",
          items: [
            {
              product_id: 101,
              name: "Sample 4K Smart TV (55 inches)",
              quantity: 1,
              price: 5499.00,
              image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80"
            }
          ]
        }
      ]);
      setLoading(false);
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        const rows = await getOrders();
        setOrders(Array.isArray(rows) ? rows : []);
      } catch (err) {
        setError(err?.response?.data?.error || "Unable to load orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated, authLoading]);

  const handleBuyAgain = async (item) => {
    try {
      await addToCart(item.product_id, 1);
      showInline(`"${item.name}" added to cart!`);
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      showInline("Failed to add to cart.", "error");
    }
  };

  const handleMockAction = (name) => {
    showInline(`${name} feature is currently in simulation mode for this order.`);
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toString().includes(term) ||
        order.items.some(item => item.name.toLowerCase().includes(term))
      );
    }

    if (activeTab === "not_shipped") {
      result = result.filter(o => o.status.toLowerCase() !== "delivered" && o.status.toLowerCase() !== "cancelled");
    } else if (activeTab === "cancelled") {
      result = result.filter(o => o.status.toLowerCase() === "cancelled");
    } else if (activeTab === "buy_again") {

      result = result.filter(o => o.status.toLowerCase() === "delivered");
    }

    return result;
  }, [orders, searchTerm, activeTab]);

  if (loading) {
    return (
      <main className="order-history-page">
        <div className="loading-orders">Loading your orders...</div>
      </main>
    );
  }

  return (
    <main className="order-history-page">
      <div className="orders-header-row">
        <h1>Your Orders</h1>
        <div className="order-search-container">
          <input
            type="text"
            placeholder="Search all orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>

      {}
      <nav className="orders-nav-tabs">
        <span className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</span>
        <span className={activeTab === "buy_again" ? "active" : ""} onClick={() => setActiveTab("buy_again")}>Buy Again</span>
        <span className={activeTab === "not_shipped" ? "active" : ""} onClick={() => setActiveTab("not_shipped")}>Not Yet Shipped</span>
        <span className={activeTab === "cancelled" ? "active" : ""} onClick={() => setActiveTab("cancelled")}>Cancelled Orders</span>
      </nav>

      {}
      {inlineMsg && (
        <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
          <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
          {inlineMsg.text}
        </div>
      )}

      {}
      <div className="orders-info-bar">
        <span><strong>{filteredOrders.length} orders</strong> placed in </span>
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="3months">past 3 months</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {error && <div className="inline-msg inline-msg--error">{error}</div>}

      {filteredOrders.length === 0 ? (
        <div className="no-orders-box">
          <p>You have not placed any orders in {timeFilter === '3months' ? 'the past 3 months' : timeFilter}.</p>
          <Link to="/" className="link-style">Return to shop</Link>
        </div>
      ) : (
        <div className="orders-container">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {}
              <div className="order-card-header">
                <div className="order-header-left">
                  <div className="header-col">
                    <span className="header-label">Order Placed</span>
                    <span className="header-value">{new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="header-col">
                    <span className="header-label">Total</span>
                    <span className="header-value">₹{Number(order.total_amount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="header-col ship-to-col">
                    <span className="header-label">Ship To</span>
                    <div className="ship-to-dropdown">
                      <span className="header-value link-style">{order.full_name || order.user_name || "Customer"} ▾</span>
                      <div className="ship-to-content">
                        <p><strong>{order.full_name || order.user_name}</strong></p>
                        <p>{order.line1 || "Processing address..."}</p>
                        {order.line2 && <p>{order.line2}</p>}
                        <p>{order.city}{order.state ? `, ${order.state}` : ""} {order.pincode}</p>
                        <p>{order.country || "India"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-header-right">
                  <div className="header-col" style={{ textAlign: "right" }}>
                    <span className="header-label">Order # {order.id}</span>
                    <div className="header-links">
                      <span className="link-style">View order details</span>
                      <span className="separator">|</span>
                      <span className="link-style">Invoice</span>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="order-card-content">
                <div className="order-main-area">
                  <div className="order-status-tag">
                    {order.status === 'Pending' ? `Arriving ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'short' })}` : `Status: ${order.status}`}
                  </div>

                  {order.items.map((item, idx) => (
                    <div key={`${order.id}-item-${idx}`} className="order-product-row">
                      <div className="product-img-box">
                        <img src={item.image_url} alt={item.name} />
                      </div>
                      <div className="product-details-box">
                        <Link to={`/product/${item.product_id}`} className="product-title-link">
                          {item.name}
                        </Link>
                        <p className="product-meta">Quantity: {item.quantity}</p>
                        <div className="btn-row">
                          <button className="amazon-yellow-btn" onClick={() => handleBuyAgain(item)}>
                            ↻ Buy it again
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-actions-area">
                  <button className="btn-simple" onClick={() => handleMockAction("Track Package")}>Track package</button>
                  <button className="btn-simple" onClick={() => handleMockAction("Return Items")}>Return items</button>
                  <button className="btn-simple" onClick={() => handleMockAction("Product Review")}>Write a product review</button>
                  <button className="btn-simple" onClick={() => handleMockAction("Archive Order")}>Archive order</button>
                </div>
              </div>

              {}
              <div className="order-card-footer">
                <span className="link-style">Problem with order?</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
