import CategoryGridCard from "./CategoryGridCard";
import "../styles/HomeGrids.css";

export default function HomeGrids() {
  const gridData = [
    {
      title: "Revamp your home in style",
      items: [
        { label: "Cushion covers, bedsheets", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80" },
        { label: "Figurines, vases & more", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80" },
        { label: "Home storage", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80" },
        { label: "Lighting solutions", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80" },
      ],
      linkText: "Explore all",
      linkUrl: "/category/home_kitchen"
    },
    {
      title: "Appliances for your home | Up to 55% off",
      items: [
        { label: "Air conditioners", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" },
        { label: "Refrigerators", image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80" },
        { label: "Microwaves", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80" },
        { label: "Washing machines", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80" },
      ],
      linkText: "See more",
      linkUrl: "/category/electronics"
    },
    {
      title: "Up to 60% off | Styles for Men",
      items: [
        { label: "Clothing", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
        { label: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80" },
        { label: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" },
        { label: "Bags & Wallets", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
      ],
      linkText: "End of season sale",
      linkUrl: "/category/fashion"
    },
    {
      title: "Starting ₹99 | All your home improvement needs",
      items: [
        { label: "Cleaning supplies", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80" },
        { label: "Bathroom accessories", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80" },
        { label: "Home tools", image: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=400&q=80" },
        { label: "Wallpapers", image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=400&q=80" },
      ],
      linkText: "Explore more",
      linkUrl: "/category/home_kitchen"
    }
  ];

  return (
    <div className="home-grids-outer">
      <div className="home-grids-row">
        {gridData.map((grid, idx) => (
          <CategoryGridCard key={idx} {...grid} />
        ))}
      </div>
    </div>
  );
}
