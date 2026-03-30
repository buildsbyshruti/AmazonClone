import "../styles/CategorySection.css";

export default function CategorySection({ title, items }) {
  return (
    <div className="category-section">
      <h2 className="section-title">{title}</h2>
      <div className="category-grid">
        {items.map((item, index) => (
          <div key={index} className="category-item">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <a href="#" className="see-more-link">
        Explore all
      </a>
    </div>
  );
}
