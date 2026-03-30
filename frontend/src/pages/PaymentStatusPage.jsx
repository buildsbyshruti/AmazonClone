import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CheckoutPage.css";

export default function PaymentStatusPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <div className="spinner"></div>
        <h2>Processing your payment...</h2>
        <p>Please do not refresh the page or click back.</p>
        <div className="payment-security-badge">
           <svg viewBox="0 0 24 24" width="20" height="20" fill="#067d62"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
           <span>Secure SSL Encryption</span>
        </div>
      </div>
      <style>{`
        .payment-status-container {
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7fafa;
        }
        .payment-status-card {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #e77600;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .payment-status-card h2 {
          font-size: 22px;
          margin-bottom: 10px;
          color: #111;
        }
        .payment-status-card p {
          color: #565959;
          font-size: 14px;
          margin-bottom: 25px;
        }
        .payment-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #067d62;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
