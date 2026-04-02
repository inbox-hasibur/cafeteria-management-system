import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import api from "../../utils/api";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    let endpoint = currentState === "Login" || currentState === "Admin Login" ? "/api/user/login" : "/api/user/register";

    try {
      const response = await api.post(endpoint, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        
        // Store Admin status and redirect
        if (response.data.user && response.data.user.role === "admin") {
          localStorage.setItem("isAdmin", "true");
          window.location.href = "/admin/add"; // Force reload to pickup route layout
        } else {
          localStorage.setItem("isAdmin", "false");
        }

        setShowLogin(false);
        toast.success(`Successfully ${currentState === "Sign Up" ? "registered" : "logged in"}!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={data.name}
              onChange={onChangeHandler}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={data.email}
            onChange={onChangeHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={data.password}
            onChange={onChangeHandler}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : (currentState === "Sign Up" ? "Create account" : "Login")}
        </button>
        {currentState === "Login" && (
          <>
            <p>Don't have an account? <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span></p>
            <p>Are you an Admin? <span onClick={() => setCurrentState("Admin Login")}>Admin Login</span></p>
          </>
        )}
        {currentState === "Sign Up" && (
          <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login</span></p>
        )}
        {currentState === "Admin Login" && (
          <p>Back to Customer? <span onClick={() => setCurrentState("Login")}>Login</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
