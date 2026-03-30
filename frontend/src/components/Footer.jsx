import { Link } from "react-router-dom";
import "../styles/Footer.css";

const footerGroups = [
  {
    heading: "Get to Know Us",
    links: [
      { label: "About Amazon", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Press Releases", to: "/press" },
      { label: "Amazon Science", to: "/science" },
    ],
  },
  {
    heading: "Connect with Us",
    links: [
      { label: "Facebook", to: "/facebook" },
      { label: "Twitter", to: "/twitter" },
      { label: "Instagram", to: "/instagram" },
    ],
  },
  {
    heading: "Make Money with Us",
    links: [
      { label: "Sell on Amazon", to: "/sell" },
      { label: "Protect and Build Your Brand", to: "/brand-protection" },
      { label: "Amazon Global Selling", to: "/global-selling" },
      { label: "Advertise Your Products", to: "/advertise" },
    ],
  },
  {
    heading: "Let Us Help You",
    links: [
      { label: "Your Account", to: "/account" },
      { label: "Your Orders", to: "/orders" },
      { label: "Returns Centre", to: "/returns" },
      { label: "Help", to: "/help" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms and Conditions", to: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <button
        type="button"
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>

      <div className="footer-main">
        <div className="footer-grid">
          {footerGroups.map((group) => (
            <section key={group.heading} className="footer-column">
              <h3>{group.heading}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-brand">amazon.in clone</div>
        <nav className="footer-legal-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Conditions of Use</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/help">Help</Link>
        </nav>
      </div>
    </footer>
  );
}
