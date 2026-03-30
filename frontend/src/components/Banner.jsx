import { useEffect, useState } from "react";
import "../styles/Banner.css";

const banners = [
  {
    image: "/banner.png",
    title: "Starting ₹199",
    subtitle: "Celebrate summer with top deals",
    promo: "Up to 70% Off",
    linkText: "Plus extra savings on your first purchase",
  },
  {
    image: "/banner_electronics.png",
    title: "Latest Tech",
    subtitle: "Upgrade your gadgets today",
    promo: "Up to 40% Off",
    linkText: "Deals on smartphones, laptops & more",
  },
  {
    image: "/banner_home.png",
    title: "Home Decor",
    subtitle: "Revamp your living space",
    promo: "Flat 50% Off",
    linkText: "Elegant furniture and decor items",
  },
];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner">
      <button className="banner-nav prev" onClick={handlePrev} aria-label="Previous Slide">
        ‹
      </button>
      <button className="banner-nav next" onClick={handleNext} aria-label="Next Slide">
        ›
      </button>

      {banners.map((b, index) => (
        <div
          key={index}
          className={`banner-slide ${index === currentIndex ? "active" : ""}`}
        >
          <img src={b.image} alt={b.title} className="banner-bg" />
          <div className="banner-fade" />
          <div className="banner-content">
            <h2 className="banner-title">{b.title}</h2>
            <p className="banner-subtitle">{b.subtitle}</p>
            <div className="banner-promo">
              <span className="promo-badge">{b.promo}</span>
              <p>{b.linkText}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="banner-dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}
