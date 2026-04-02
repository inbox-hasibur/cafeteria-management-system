import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { token, setToken, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setToken("");
    navigate("/");
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
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={(e) => { setMenu("home"); window.scrollTo(0, 0); }}
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
          Find-us
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
        {/* <img src={assets.search_icon} alt="Search" /> */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalQuantity() > 0 && <div className="dot"></div>}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li>
                <Link to="/myorders" style={{ display: "flex", gap: "10px" }}>
                  <img src={assets.bag_icon} alt="Orders" />
                  <p>Orders</p>
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
