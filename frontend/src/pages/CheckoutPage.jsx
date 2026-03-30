import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCart, placeOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/CheckoutPage.css";

const initialShipping = {
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage({ onCartUpdated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const directItems = location.state?.directItems;
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState({
    items: [],
    summary: { subtotal: 0, total: 0, item_count: 0 },
  });
  const [shipping, setShipping] = useState(initialShipping);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [procMsg, setProcMsg] = useState("Processing your order...");
  const [paymentDetails, setPaymentDetails] = useState({ upiId: "", cardNum: "", cardExp: "", cardCvv: "" });
  const [errors, setErrors] = useState({});

  const [inlineMsg, setInlineMsg] = useState(null);

  function showInline(text, type = "success") {
    setInlineMsg({ text, type });
    if (type === "success") {
      setTimeout(() => setInlineMsg(null), 3500);
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    async function loadCart() {
      if (directItems) {
        const subtotal = directItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        const totalItemsCount = directItems.reduce((acc, item) => acc + item.quantity, 0);
        setCart({
          items: directItems,
          summary: { subtotal, total: subtotal, item_count: totalItemsCount }
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCart();
        setCart(data);
      } catch (err) {
        showInline(err?.response?.data?.error || "Unable to load checkout data. Check your connection.", "error");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated, authLoading, navigate, location, directItems]);

  const validateAddress = () => {
    const newErrors = {};
    if (!shipping.full_name) newErrors.full_name = "Full name is required";
    if (!shipping.phone || shipping.phone.length < 10) newErrors.phone = "Provide a valid 10-digit number";
    if (!shipping.line1) newErrors.line1 = "Address is required";
    if (!shipping.city) newErrors.city = "City is required";
    if (!shipping.pincode || shipping.pincode.length < 6) newErrors.pincode = "Provide a valid pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateAddress()) {
      return;
    }
    if (step === 2) {
      if (paymentMethod === "upi" && !paymentDetails.upiId.includes("@")) {
         showInline("Please enter a valid UPI ID", "error");
         return;
      }
      if (paymentMethod === "card" && (paymentDetails.cardNum.length < 16)) {
         showInline("Please enter a valid Card Number", "error");
         return;
      }
    }
    setInlineMsg(null);
    setStep(step + 1);
  };
  const handlePrevStep = () => setStep(step - 1);

  async function handlePlaceOrder() {
    setPlacing(true);
    setProcMsg("Processing your order...");
    
    // Artificial stages for "Wow" factor and Amazon parity
    setTimeout(() => setProcMsg("Verifying payment details..."), 800);
    setTimeout(() => setProcMsg("Finalizing your order..."), 1800);

    const minimumWait = new Promise(resolve => setTimeout(resolve, 2600));

    try {
      const orderPromise = placeOrder(shipping, directItems);
      const [response] = await Promise.all([orderPromise, minimumWait]);

      if (onCartUpdated) onCartUpdated();
      navigate(`/order-confirmation/${response.order_id || 'DEMO-' + Date.now()}`);
    } catch (err) {
      console.error("Order placement error:", err);
      await minimumWait;
      
      if (onCartUpdated) onCartUpdated();
      navigate(`/order-confirmation/DEMO-${Date.now()}`);
    }
    // We don't setPlacing(false) here because we are navigating away 
    // and want the overlay to stay until the next page loads.
  }

  if (loading) return <div className="checkout-loading">Preparing your order...</div>;

  return (
    <div className="checkout-page-container">
      {placing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="amazon-spinner"></div>
            <h2>{procMsg}</h2>
            <p>Please do not refresh or close this page.</p>
          </div>
        </div>
      )}
      <main className="checkout-main">
        <div className="checkout-steps-column">

          {inlineMsg && (
            <div className={`inline-msg inline-msg--${inlineMsg.type}`}>
              <span className="inline-msg-icon">{inlineMsg.type === "success" ? "✓" : "!"}</span>
              {inlineMsg.text}
            </div>
          )}

          <div className={`checkout-step-card ${step === 1 ? "active" : "completed"}`}>
            <div className="step-header">
              <span className="step-number">1</span>
              <h3>Delivery address</h3>
              {step > 1 && <button className="step-change-btn" onClick={() => setStep(1)}>Change</button>}
            </div>
            {step === 1 ? (
              <div className="step-content">
                <div className="address-form">
                  <div className="input-group">
                    <input type="text" placeholder="Full name" value={shipping.full_name} onChange={(e) => setShipping({...shipping, full_name: e.target.value})} className={errors.full_name ? "invalid" : ""} required />
                    {errors.full_name && <span className="inline-error">{errors.full_name}</span>}
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="Mobile number" value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} className={errors.phone ? "invalid" : ""} required />
                    {errors.phone && <span className="inline-error">{errors.phone}</span>}
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="Pincode" value={shipping.pincode} onChange={(e) => setShipping({...shipping, pincode: e.target.value})} className={errors.pincode ? "invalid" : ""} required />
                    {errors.pincode && <span className="inline-error">{errors.pincode}</span>}
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="Address Line 1" value={shipping.line1} onChange={(e) => setShipping({...shipping, line1: e.target.value})} className={errors.line1 ? "invalid" : ""} required />
                    {errors.line1 && <span className="inline-error">{errors.line1}</span>}
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="Address Line 2" value={shipping.line2} onChange={(e) => setShipping({...shipping, line2: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="City" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className={errors.city ? "invalid" : ""} required />
                    {errors.city && <span className="inline-error">{errors.city}</span>}
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="State" value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} required />
                  </div>
                  <button className="amazon-yellow-btn" onClick={handleNextStep}>Use this address</button>
                </div>
              </div>
            ) : (
              <div className="step-summary-text">
                {shipping.full_name}, {shipping.line1}, {shipping.city}, {shipping.pincode}
              </div>
            )}
          </div>

          <div className={`checkout-step-card ${step === 2 ? "active" : step < 2 ? "pending" : "completed"}`}>
            <div className="step-header">
              <span className="step-number">2</span>
              <h3>Payment method</h3>
              {step > 2 && <button className="step-change-btn" onClick={() => setStep(2)}>Change</button>}
            </div>
            {step === 2 && (
              <div className="step-content">
                <div className="payment-options">
                  <label className="payment-option-container">
                    <div className="payment-option">
                      <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                      <span>Payment Card</span>
                      <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" alt="card-logos" />
                    </div>
                    {paymentMethod === "card" && (
                      <div className="payment-details-input">
                        <input type="text" placeholder="Card Number (16 digits)" maxLength="16" value={paymentDetails.cardNum} onChange={(e) => setPaymentDetails({...paymentDetails, cardNum: e.target.value})} />
                        <div className="card-row">
                          <input type="text" placeholder="Expiry (MM/YY)" maxLength="5" value={paymentDetails.cardExp} onChange={(e) => setPaymentDetails({...paymentDetails, cardExp: e.target.value})} />
                          <input type="password" placeholder="CVV" maxLength="3" value={paymentDetails.cardCvv} onChange={(e) => setPaymentDetails({...paymentDetails, cardCvv: e.target.value})} />
                        </div>
                      </div>
                    )}
                  </label>

                  <label className="payment-option-container">
                    <div className="payment-option">
                      <input type="radio" name="payment" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                      <span>UPI (PayTM, GooglePay)</span>
                    </div>
                    {paymentMethod === "upi" && (
                      <div className="payment-details-input">
                        <input type="text" placeholder="yourname@upi" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} />
                      </div>
                    )}
                  </label>

                  <label className="payment-option">
                    <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <span>Cash on Delivery / Pay on Delivery</span>
                  </label>
                  <button className="amazon-yellow-btn" onClick={handleNextStep}>Continue to Review</button>
                </div>
              </div>
            )}
            {step > 2 && (
              <div className="step-summary-text">
                Ending in 1234 (Dummy {paymentMethod.toUpperCase()})
              </div>
            )}
          </div>

          <div className={`checkout-step-card ${step === 3 ? "active" : "pending"}`}>
            <div className="step-header">
              <span className="step-number">3</span>
              <h3>Review items and delivery</h3>
            </div>
            {step === 3 && (
              <div className="step-content">
                <div className="review-items-list">
                  {cart.items.map(item => (
                    <div key={item.id} className="review-item">
                      <div className="review-item-main">
                        <strong>Arriving 2 Apr 2024</strong>
                        <p>If you order in the next 2 hours</p>
                        <div className="review-item-details">
                          <img src={item.image_url} alt={item.name} />
                          <div>
                            <p className="item-name">{item.name}</p>
                            <p className="item-price">₹{item.price}</p>
                            <p className="item-qty">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="place-order-box-inner">
                   <button
                     className="amazon-yellow-btn large"
                     onClick={handlePlaceOrder}
                     disabled={placing || cart.items.length === 0}
                   >
                     {placing ? "Processing Payment..." : "Place your order"}
                   </button>
                   <p>By placing your order, you agree to Amazon's <a href="#">privacy notice</a> and <a href="#">conditions of use</a>.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="checkout-sidebar">
          <div className="sidebar-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>₹{Number(cart?.summary?.subtotal || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span className="free">₹0.00</span>
            </div>
            <div className="summary-row">
              <span>Total:</span>
              <span>₹{Number(cart?.summary?.total || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row total-big">
              <span>Order Total:</span>
              <span>₹{Number(cart?.summary?.total || 0).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
