import { Link } from "react-router-dom";
import "../styles/HelpPage.css";

export default function HelpPage() {
  return (
    <div className="help-page">
      <div className="help-container">
        <h1>Hello. What can we help you with?</h1>
        <div className="help-search">
          <input type="text" placeholder="Search our help topics" />
          <button className="amazon-btn-yellow">Search</button>
        </div>

        <div className="help-grid">
          <div className="help-card">
            <img src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Box-v2._CB424057133_.png" alt="Orders" />
            <div className="card-text">
              <h3>Your Orders</h3>
              <p>Track packages, edit or cancel orders</p>
            </div>
          </div>
          <div className="help-card">
            <img src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Returns-v2._CB424057538_.png" alt="Returns" />
            <div className="card-text">
              <h3>Returns & Refunds</h3>
              <p>Return or exchange items, print return labels</p>
            </div>
          </div>
          <div className="help-card">
            <img src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Address-v2._CB424057530_.png" alt="Address" />
            <div className="card-text">
              <h3>Manage Address</h3>
              <p>Update your delivery addresses</p>
            </div>
          </div>
          <div className="help-card">
            <img src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Prime_clear-v2._CB424057121_.png" alt="Prime" />
            <div className="card-text">
              <h3>Manage Prime</h3>
              <p>View your benefits, change your membership</p>
            </div>
          </div>
          <div className="help-card">
             <img src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Payments-v2._CB424057532_.png" alt="Payment" />
             <div className="card-text">
               <h3>Payment Settings</h3>
               <p>Add or edit payment methods</p>
             </div>
          </div>
          <div className="help-card">
             <img src="https://m.media-amazon.com/images/G/31/x-locale/cs/help/images/gateway/Digital-v2._CB424057534_.png" alt="Digital" />
             <div className="card-text">
               <h3>Account Settings</h3>
               <p>Change email, password, or security settings</p>
             </div>
          </div>
        </div>

        <div className="help-links-section">
           <div className="link-column">
             <h4>Recommended Topics</h4>
             <Link to="#">Where's my order?</Link>
             <Link to="#">Track your package</Link>
             <Link to="#">Cancel an item or order</Link>
             <Link to="#">Returns and refunds</Link>
           </div>
           <div className="link-column">
             <h4>Shipping & Delivery</h4>
             <Link to="#">Shipping rates & times</Link>
             <Link to="#">Free delivery</Link>
             <Link to="#">Undeliverable packages</Link>
             <Link to="#">Contact carrier</Link>
           </div>
           <div className="link-column">
             <h4>Amazon Prime</h4>
             <Link to="#">About Amazon Prime</Link>
             <Link to="#">Prime member benefits</Link>
             <Link to="#">Join Amazon Prime</Link>
             <Link to="#">Cancel Prime membership</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
