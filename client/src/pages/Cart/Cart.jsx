import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/config";

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);

  const navigate = useNavigate();

  if (getTotalCartAmount() === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button onClick={() => navigate("/")} className="shop-btn">
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-layout">
      <div className="cart-items">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <p>Review your items before checkout</p>
        </div>
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            const imgSrc =
              item.image && item.image.startsWith("http")
                ? item.image
                : `${API_BASE}/images/${item.image}`;
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={imgSrc} alt={item.name} />
                  <p>{item.name}</p>
                  <p>BDT {item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>BDT {item.price * cartItems[item._id]}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                    title="Remove item"
                  >
                    ✕
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>BDT {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>BDT 70</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>BDT {getTotalCartAmount() + 70}</b>
            </div>
          </div>
          <div className="cart-buttons">
            <button className="submit-btn" onClick={() => navigate("/order")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Cart;
