import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/api";
import "../styles/OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        // Resilience: If it's a DEMO ID and we can't fetch it, we generate it locally
        if (orderId && orderId.startsWith("DEMO-")) {
          try {
            const data = await getOrderById(orderId);
            setOrder(data);
          } catch (apiErr) {
            console.warn("DEMO API failed, using local mock data...");
            setOrder({
              id: orderId,
              status: "Shipment pending",
              total: "27,999",
              total_amount: 27999,
              full_name: "Shruti Mittal",
              line1: "Mamupur 140413",
              city: "Mamupur",
              state: "Dera Bassi",
              pincode: "140413",
              country: "India",
              phone: "9876543210",
              created_at: new Date().toISOString(),
              items: [{ product_id: 1, product_name: "Premium LED Smart TV", quantity: 1, price: 27999, total_price: 27999, image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200" }]
            });
          }
        } else {
          const data = await getOrderById(orderId);
          setOrder(data);
        }
      } catch (err) {
        setError(err?.response?.data?.error || "Unable to load order details");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();

    const timer = setInterval(() => {
        setCountdown((prev) => {
            if (prev <= 1) {
                clearInterval(timer);
                navigate("/");
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, navigate]);

  if (loading) {
    return (
      <main className="container confirmation-page">
        Loading confirmation...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="container confirmation-page">
        {error || "Order not found"}
      </main>
    );
  }

  return (
    <main className="container confirmation-page">
      <section className="confirmation-card">
        <div className="success-header">
          <div className="success-icon-container">
            <div className="success-checkmark">✓</div>
          </div>
          <div className="success-text">
            <h1>Order placed successfully</h1>
            <p>Confirmation will be sent to your email.</p>
          </div>
        </div>

        <div className="amazon-order-summary-card">
            <div className="summary-card-header">
                <div className="header-col">
                    <span className="label">ORDER PLACED</span>
                    <span className="value">{new Date(order.created_at || Date.now()).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="header-col">
                    <span className="label">TOTAL</span>
                    <span className="value">₹{Number(order.total_amount || order.total || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="header-col">
                    <span className="label">SHIP TO</span>
                    <span className="value link-style">{order.full_name || "Shruti Mittal"} ▾</span>
                </div>
                <div className="header-col flex-end">
                    <span className="label">ORDER # {order.id}</span>
                </div>
            </div>

            <div className="summary-card-body">
                <div className="status-indicator">
                    <h2>Status: {order.status || 'Pending'}</h2>
                </div>
                <div className="items-list">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="summary-item-row">
                            <img src={item.image_url} alt={item.product_name} />
                            <div className="summary-item-details">
                                <p className="item-title">{item.product_name}</p>
                                <p className="item-qty">Quantity: {item.quantity}</p>
                                <button className="buy-again-btn">↻ Buy it again</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="redirect-info">
            <p>Redirecting to homepage in <strong>{countdown}</strong> seconds...</p>
        </div>
        <div className="confirmation-actions">
          <Link to="/">Continue Shopping</Link>
          <Link to="/orders">Return to Orders</Link>
        </div>
      </section>
      <style>{`
        .confirmation-page {
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }
        .amazon-order-summary-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 25px;
        }
        .summary-card-header {
            background-color: #f0f2f2;
            padding: 12px 18px;
            display: flex;
            gap: 40px;
            border-bottom: 1px solid #ddd;
            color: #565959;
            font-size: 12px;
        }
        .summary-card-header .header-col {
            display: flex;
            flex-direction: column;
        }
        .summary-card-header .label {
            text-transform: uppercase;
            font-size: 11px;
            margin-bottom: 3px;
        }
        .summary-card-header .value {
            color: #111;
            font-size: 13px;
        }
        .flex-end {
            margin-left: auto;
            text-align: right;
        }
        .summary-card-body {
            padding: 20px;
        }
        .status-indicator h2 {
            font-size: 18px;
            font-weight: 700;
            color: #111;
            margin-bottom: 15px;
        }
        .summary-item-row {
            display: flex;
            gap: 20px;
            margin-top: 15px;
        }
        .summary-item-row img {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border: 1px solid #eee;
            border-radius: 4px;
        }
        .item-title {
            color: #007185;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 5px;
        }
        .item-qty {
            font-size: 12px;
            color: #565959;
            margin-bottom: 10px;
        }
        .buy-again-btn {
            background: #ffd814;
            border: 1px solid #fcd200;
            border-radius: 8px;
            padding: 5px 15px;
            font-size: 13px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(213,217,217,0.5);
        }
        .link-style {
            color: #007185;
            cursor: pointer;
        }
        .link-style:hover {
            color: #c45500;
            text-decoration: underline;
        }
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        .redirect-info {
            text-align: center;
            margin: 30px 0 15px;
            color: #565959;
            font-size: 14px;
        }
        .redirect-info strong {
            color: #B12704;
        }
        .confirmation-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .confirmation-actions a {
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s;
        }
        .confirmation-actions a:first-child {
            background: #ffd814;
            color: #111;
            border: 1px solid #fcd200;
            box-shadow: 0 2px 5px rgba(213,217,217,0.5);
        }
        .confirmation-actions a:last-child {
            background: white;
            color: #111;
            border: 1px solid #ddd;
            box-shadow: 0 2px 5px rgba(213,217,217,0.5);
        }
        .confirmation-actions a:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        @media (max-width: 600px) {
            .summary-card-header {
                flex-wrap: wrap;
                gap: 15px;
            }
            .flex-end {
                width: 100%;
                text-align: left;
                margin-left: 0;
            }
        }
      `}</style>
    </main>
  );
}
