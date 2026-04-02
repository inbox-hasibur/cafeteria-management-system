import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const scrollToFoodDisplay = () => {
    const foodDisplay = document.getElementById("food-display");
    if (foodDisplay) {
      foodDisplay.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMenu("menu");
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMenu("contact-us");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu == "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#food-display"
          onClick={(e) => {
            e.preventDefault();
            scrollToFoodDisplay();
          }}
          className={menu == "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#"
          onClick={() => setMenu("find-us")}
          className={menu == "find-us" ? "active" : ""}
        >
          Find-us
        </a>
        <a
          href="#footer"
          onClick={scrollToContact}
          className={menu == "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="" /> */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className="dot"></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li>
                <Link to="/myorders" style={{ display: "flex", gap: "10px" }}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </Link>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
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
