import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";

// Monochromatic SVG icons — inherit currentColor for theme compatibility
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const Navbar = ({ setShowLogin, className }) => {
  const [menu, setMenu] = useState("home");
  const { token, setToken, cartItems } = useContext(StoreContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setToken("");
    navigate("/");
    toast.success("Logged out successfully");
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getTotalQuantity = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  return (
    <div className={`navbar ${className || ''}`}>
      <Link to="/">
        <img src={assets.logo} alt="IUBAT Cafeteria" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => { setMenu("home"); window.scrollTo(0, 0); }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={(e) => { setMenu("menu"); scrollToSection(e, "explore-menu"); }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#find-us"
          onClick={(e) => { setMenu("find-us"); scrollToSection(e, "find-us"); }}
          className={menu === "find-us" ? "active" : ""}
        >
          Find Us
        </a>
        <a
          href="#footer"
          onClick={(e) => { setMenu("contact-us"); scrollToSection(e, "footer"); }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        {/* Monochromatic Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalQuantity() > 0 && (
            <div className="dot">
              <span>{getTotalQuantity()}</span>
            </div>
          )}
        </div>

        {!token ? (
          <button className="signin-btn" onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li>
                <Link to="/myorders" style={{ display: "flex", gap: "10px" }}>
                  <img src={assets.bag_icon} alt="Orders" />
                  <p>My Orders</p>
                </Link>
              </li>
              {localStorage.getItem("isAdmin") === "true" && (
                <>
                  <hr />
                  <li>
                    <Link to="/admin" style={{ display: "flex", gap: "10px" }}>
                      <img src={assets.profile_icon} width="20" alt="Admin" />
                      <p>Dashboard</p>
                    </Link>
                  </li>
                </>
              )}
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
