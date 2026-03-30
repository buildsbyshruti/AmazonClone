import "../styles/CategoryGridCard.css";
import { Link } from "react-router-dom";

export default function CategoryGridCard({ title, items, linkText, linkUrl }) {
  return (
    <div className="category-grid-card">
      <h2 className="grid-title">{title}</h2>
      <div className="grid-quad">
        {items.map((item, idx) => (
          <Link key={idx} to={item.url || linkUrl || "/"} className="grid-item">
            <div className="grid-item-image">
              <img src={item.image} alt={item.label} />
            </div>
            <span className="grid-item-label">{item.label}</span>
          </Link>
        ))}
      </div>
      <Link
        to={linkUrl || "/"}
        className="grid-see-more"
        style={{ cursor: "pointer", zIndex: 10, position: "relative" }}
      >
        {linkText || "See more"}
      </Link>
    </div>
  );
}
