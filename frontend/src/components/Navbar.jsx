import "../styles/Navbar.css";
import { headerMenuCategories } from "../data/mockCatalog";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import CartDropdown from "./CartDropdown";
import "../styles/Sidebar.css";

export default function Navbar({
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearch,
  cartCount,
  cart = { items: [] },
  onUpdateCartQty,
  onRemoveCartItem,
  user,
  onLogout,
}) {
  const navigate = useNavigate();
  const [showLang, setShowLang] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showPrime, setShowPrime] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState({
    city: "Fetching",
    pincode: "...",
  });
  const langRef = useRef();
  const signInRef = useRef();
  const cartRef = useRef();
  const signInTimer = useRef(null);
  const langTimer = useRef(null);
  const cartTimer = useRef(null);
  const primeTimer = useRef(null);

  const detectLocation = useCallback(() => {
    async function fetchNameFromCoords(lat, lon) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        );
        const data = await res.json();
        if (data && data.address) {
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state_district ||
            "Detected";
          const postcode = data.address.postcode || "";
          setUserLocation({ city, pincode: postcode });
        }
      } catch (err) {
        console.error("Reverse geo failed:", err);
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchNameFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        async (err) => {
          console.warn("Geo denied, falling back to IP:", err.message);
          try {
            const resIP = await fetch("https://ipapi.co/json/");
            const dataIP = await resIP.json();
            if (dataIP && dataIP.city) {
              setUserLocation({
                city: dataIP.city,
                pincode: dataIP.postal || "",
              });
            } else {
              setUserLocation({ city: "India", pincode: "" });
            }
          } catch (ipErr) {
            setUserLocation({ city: "India", pincode: "" });
          }
        },
      );
    }
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (signInRef.current && !signInRef.current.contains(event.target)) {
        setShowSignIn(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateLocation = () => {
    setUserLocation({ city: "Fetching", pincode: "..." });
    detectLocation();
  };

  function handleSearchSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = (formData.get("query") || "").toString();
    const category = (formData.get("category") || "all").toString();

    if (onCategorySelect) onCategorySelect(category);
    if (onSearch) onSearch(value);

    navigate(`/search?category=${category}&q=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
      />
      <div className="demo-disclaimer-banner">
        <span>⚠️ <strong>PROTOTYPE ONLY:</strong> This is a non-commercial educational project for portfolio purposes. <strong>Not the real Amazon.</strong></span>
        <button onClick={(e) => { e.currentTarget.parentElement.style.display='none' }} className="close-disclaimer">×</button>
      </div>
      <header className="amazon-header-fixed">
      <nav className="navbar-top">
        <div className="navbar-top-content">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Menu"
          >
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="white"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <Link to="/" className="amazon-logo-box" style={{ display: "flex", alignItems: "baseline", paddingTop: "12px" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
              alt="Amazon Logo"
              style={{ width: "80px", filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <div className="location">
            <div className="location-icon">
              <svg
                width="15"
                height="18"
                viewBox="0 0 15 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 0.5C3.36 0.5 0 3.86 0 8C0 13.12 7.5 17.5 7.5 17.5C7.5 17.5 15 13.12 15 8C15 3.86 11.64 0.5 7.5 0.5ZM7.5 11.25C5.705 11.25 4.25 9.795 4.25 8C4.25 6.205 5.705 4.75 7.5 4.75C9.295 4.75 10.75 6.205 10.75 8C10.75 9.795 9.295 11.25 7.5 11.25Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="location-text-box">
              <span className="location-label">
                Delivering to {userLocation.city} {userLocation.pincode}
              </span>
              <span className="update-location" onClick={handleUpdateLocation}>
                Update location
              </span>
            </div>
          </div>

          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <select
              className="search-select"
              name="category"
              value={selectedCategory}
              onChange={(e) => onCategorySelect(e.target.value)}
            >
              {headerMenuCategories.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <input
              name="query"
              type="text"
              placeholder="Search Amazon.in"
              className="search-input"
              defaultValue={searchQuery}
            />
            <button className="search-btn" type="submit" aria-label="Search">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <div className="nav-right">
            <div
              className="nav-item lang-select"
              ref={langRef}
              onMouseEnter={() => {
                if (langTimer.current) clearTimeout(langTimer.current);
                setShowLang(true);
              }}
              onMouseLeave={() => {
                langTimer.current = setTimeout(() => setShowLang(false), 200);
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                alt="IN"
                style={{ width: 18, height: 12, marginRight: 4, verticalAlign: "middle", borderRadius: "1px" }}
              />
              <span className="nav-value">EN <span className="nav-arrow" style={{ fontSize: '10px', color: '#ccc', marginLeft: '2px' }}>▼</span></span>
              {showLang && (
                <div className="lang-dropdown">
                  <div className="lang-title">Change Language</div>
                  <label>
                    <input type="radio" name="lang" defaultChecked /> English -
                    EN
                  </label>
                  <label>
                    <input type="radio" name="lang" /> हिन्दी - HI
                  </label>
                  <label>
                    <input type="radio" name="lang" /> தமிழ் - TA
                  </label>
                  <label>
                    <input type="radio" name="lang" /> తెలుగు - TE
                  </label>
                  <label>
                    <input type="radio" name="lang" /> ಕನ್ನಡ - KN
                  </label>
                  <label>
                    <input type="radio" name="lang" /> മലയാളം - ML
                  </label>
                  <label>
                    <input type="radio" name="lang" /> বাংলা - BN
                  </label>
                  <label>
                    <input type="radio" name="lang" /> मराठी - MR
                  </label>
                  <div className="lang-region">
                    You are shopping on Amazon.in
                    <br />
                    <a href="#">Change country/region</a>
                  </div>
                </div>
              )}
            </div>
            <div
              className="nav-item sign-in"
              ref={signInRef}
              onMouseEnter={() => {
                if (signInTimer.current) clearTimeout(signInTimer.current);
                setShowSignIn(true);
              }}
              onMouseLeave={() => {
                signInTimer.current = setTimeout(() => setShowSignIn(false), 200);
              }}
              onClick={() => navigate("/login")}
            >
              <span className="nav-label">Hello, {user ? user.name : "sign in"}</span>
              <span className="nav-value">
                Account & Lists
                <svg viewBox="0 0 10 7" width="8" className="nav-arrow"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              {showSignIn && (
                <div className="signin-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="signin-top">
                    {user ? (
                      <button className="signin-btn" onClick={(e) => { e.stopPropagation(); onLogout(); }}>Sign Out</button>
                    ) : (
                      <button className="signin-btn" onClick={(e) => { e.stopPropagation(); navigate("/login"); }}>Sign in</button>
                    )}
                    {!user && (
                      <div className="signin-new">
                        New customer? <Link to="/register" onClick={(e) => e.stopPropagation()}>Start here.</Link>
                      </div>
                    )}
                  </div>
                  <div className="signin-content">
                    <div className="signin-column">
                      <div className="signin-title">Your Lists</div>
                      <ul>
                        <li><Link to="/wishlist">Your Wish List</Link></li>
                        <li><a href="#">Create a Wish List</a></li>
                        <li><a href="#">Wish from Any Website</a></li>
                        <li><a href="#">Baby Wishlist</a></li>
                        <li><a href="#">Discover Your Style</a></li>
                        <li><a href="#">Explore Showroom</a></li>
                      </ul>
                    </div>
                    <div className="signin-column">
                      <div className="signin-title">Your Account</div>
                      <ul>
                        <li><Link to="/profile">Your Account</Link></li>
                        <li><Link to="/orders">Your Orders</Link></li>
                        <li><Link to="/wishlist">Your Wish List</Link></li>
                        <li><a href="#">Keep shopping for</a></li>
                        <li><a href="#">Your Recommendations</a></li>
                        <li><a href="#">Your Prime Membership</a></li>
                        <li><a href="#">Your Prime Video</a></li>
                        <li><a href="#">Your Subscribe & Save Items</a></li>
                        <li><a href="#">Memberships & Subscriptions</a></li>
                        <li><a href="#">Your Seller Account</a></li>
                        <li><a href="#">Manage Your Content and Devices</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/orders" className="nav-item">
              <span className="nav-label">Returns</span>
              <span className="nav-value">& Orders</span>
            </Link>
            <Link
              to="/cart"
              className="nav-item cart"
              ref={cartRef}
              onMouseEnter={() => {
                if (cartTimer.current) clearTimeout(cartTimer.current);
                setShowCart(true);
              }}
              onMouseLeave={() => {
                cartTimer.current = setTimeout(() => setShowCart(false), 200);
              }}
            >
              <span className="cart-icon">
                <svg
                  width="38"
                  height="26"
                  viewBox="0 0 38 26"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h13.72a2 2 0 0 0 2-1.61L28 6H6" />
                  <circle cx="11" cy="21" r="2" />
                  <circle cx="22" cy="21" r="2" />
                </svg>
                <span className="cart-badge">{cart?.length || 0}</span>
              </span>
              <span className="nav-value cart-text">Cart</span>
              {showCart && (
                <CartDropdown
                  cart={cart}
                  onUpdateQty={onUpdateCartQty}
                  onRemove={onRemoveCartItem}
                />
              )}
            </Link>
          </div>
        </div>
      </nav>

      <nav className="navbar-bottom">
        <div className="navbar-menu">
          {headerMenuCategories.map((item) => {
            if (item.label === "Prime") {
              return (
                <div
                  key={item.key}
                  className="menu-item-wrapper"
                  onMouseEnter={() => {
                    if (primeTimer.current) clearTimeout(primeTimer.current);
                    setShowPrime(true);
                  }}
                  onMouseLeave={() => {
                    primeTimer.current = setTimeout(() => setShowPrime(false), 200);
                  }}
                >
                  <button
                    type="button"
                    className={`menu-item ${selectedCategory === item.key ? "active" : ""}`}
                    onClick={() => {
                      onCategorySelect(item.key);
                      navigate(`/category/${item.key}`);
                    }}
                  >
                    {item.label}
                    <span className="nav-arrow" style={{ fontSize: '10px', color: '#ccc', marginLeft: '4px' }}>▼</span>
                  </button>
                  {showPrime && (
                    <div className="prime-dropdown" onClick={(e) => e.stopPropagation()}>
                      <img 
                        src="/primebox.png" 
                        alt="Amazon Prime Box" 
                        className="prime-img-top" 
                      />
                      <div className="prime-dropdown-body">
                        <h3>There's something for everyone with Prime.</h3>
                        <p>Unlimited Premium delivery, award winning TV shows, exclusive deals and more</p>
                        <div className="prime-dropdown-footer">
                          <Link to="/prime" className="prime-explore">Explore More</Link>
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Amazon_Prime_Logo.svg" 
                            alt="Amazon Prime" 
                            className="prime-logo-small" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                className={`menu-item ${selectedCategory === item.key ? "active" : ""}`}
                onClick={() => {
                  onCategorySelect(item.key);
                  if (item.key === "all") {
                    setIsSidebarOpen(true);
                  } else if (item.key === "customer_service") {
                    navigate("/help");
                  } else if (item.key === "best_sellers") {
                    navigate("/search?q=best%20sellers");
                  } else if (item.key === "deals") {
                    navigate("/search?q=deals");
                  } else {
                    navigate(`/category/${item.key}`);
                  }
                }}
              >
                {item.label === "All" && (
                  <svg
                    style={{ marginRight: 6 }}
                    height="14"
                    viewBox="0 0 20 20"
                    width="18"
                    fill="#ffffff"
                  >
                    <path d="M2 4h16v2H2V4zm0 5h16v2H2V9zm0 5h16v2H2v-2z" stroke="white" strokeWidth="0.5" />
                  </svg>
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
      </header>
    </>
  );
}
