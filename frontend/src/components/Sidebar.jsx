import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          <span className="sidebar-user-greet">Hello, {user ? user.username : 'sign in'}</span>
          <button className="sidebar-close" onClick={onClose}>&times;</button>
        </div>

        <div className="sidebar-scrollable">
          <div className="sidebar-section">
            <h3>Trending</h3>
            <ul>
              <li><Link to="/category/best_sellers" onClick={onClose}>Best Sellers</Link></li>
              <li><Link to="/category/new_releases" onClick={onClose}>New Releases</Link></li>
              <li><Link to="/category/deals" onClick={onClose}>Movers and Shakers</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Shop By Category</h3>
            <ul>
              <li><Link to="/category/electronics" onClick={onClose}>Electronics</Link></li>
              <li><Link to="/category/mobiles" onClick={onClose}>Mobiles</Link></li>
              <li><Link to="/category/fashion" onClick={onClose}>Fashion</Link></li>
              <li><Link to="/category/home_kitchen" onClick={onClose}>Home & Kitchen</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Programs & Features</h3>
            <ul>
              <li><Link to="/category/fresh" onClick={onClose}>Amazon Fresh</Link></li>
              <li><Link to="/category/mx_player" onClick={onClose}>Amazon miniTV</Link></li>
              <li><Link to="/category/prime" onClick={onClose}>Amazon Prime</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Help & Settings</h3>
            <ul>
              <li><Link to="/orders" onClick={onClose}>Your Account</Link></li>
              <li><Link to="/help" onClick={onClose}>Customer Service</Link></li>
              {user ? (
                <li><button className="sidebar-logout" onClick={() => { onLogout(); onClose(); }}>Sign Out</button></li>
              ) : (
                <li><Link to="/login" onClick={onClose}>Sign In</Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
