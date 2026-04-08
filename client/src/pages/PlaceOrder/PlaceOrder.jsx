import React, { useContext, useEffect, useRef, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, clearCart } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    division: "",
    zipCode: "",
    country: "Bangladesh",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleOfflineOrderSuccess = async (responseData, selectedPaymentMethod) => {
    await clearCart();
    setOrderDetails({
      orderId: responseData.orderId,
      token: responseData.token,
      message: responseData.message || "Order placed successfully!",
      paymentMethod: selectedPaymentMethod,
    });
    setShowModal(true);

    if (selectedPaymentMethod === "COD") {
      redirectTimeoutRef.current = setTimeout(() => {
        navigate(`/invoice/${responseData.orderId}`);
      }, 2200);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    if (orderItems.length === 0) {
      toast.error("Your cart is empty!");
      setIsSubmitting(false);
      return;
    }

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 70,
      paymentMethod: paymentMethod,
    };

    try {
      const response = await api.post("/api/orders/place", orderData);
      if (response.data.success) {
        if (paymentMethod === "COD" || paymentMethod === "bKash" || paymentMethod === "Nagad") {
          await handleOfflineOrderSuccess(response.data, paymentMethod);
        } else {
          // Stripe — redirect to payment page
          if (response.data.session_url) {
            window.location.replace(response.data.session_url);
          } else {
            toast.error("Could not initiate payment. Please try again.");
          }
        }
      } else if (
        (paymentMethod === "COD" || paymentMethod === "bKash" || paymentMethod === "Nagad") &&
        response.data.orderId
      ) {
        await handleOfflineOrderSuccess(response.data, paymentMethod);
      } else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      if (
        (paymentMethod === "COD" || paymentMethod === "bKash" || paymentMethod === "Nagad") &&
        error.response?.data?.orderId
      ) {
        await handleOfflineOrderSuccess(error.response.data, paymentMethod);
      } else {
        toast.error(
          error.response?.data?.message || "Server error. Please try again later."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street / Hall / Dormitory"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="division"
            onChange={onChangeHandler}
            value={data.division}
            type="text"
            placeholder="Division"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipCode"
            onChange={onChangeHandler}
            value={data.zipCode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="tel"
          placeholder="Phone Number"
          pattern="[0-9+\-\s]{7,15}"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
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

          <div className="payment-options">
            <h3>Payment Method</h3>
            <div className="payment-option">
              <input
                type="radio"
                id="cod"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cod">
                <span className="payment-icon">💵</span>
                Cash on Delivery
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="bkash"
                name="payment"
                value="bKash"
                checked={paymentMethod === "bKash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="bkash">
                <span className="payment-icon">🦅</span>
                bKash
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="nagad"
                name="payment"
                value="Nagad"
                checked={paymentMethod === "Nagad"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="nagad">
                <span className="payment-icon">📱</span>
                Nagad
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="stripe"
                name="payment"
                value="Stripe"
                checked={paymentMethod === "Stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="stripe">
                <span className="payment-icon">💳</span>
                Stripe (Card)
              </label>
            </div>
          </div>

          <div className="cart-buttons">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>

    {showModal && orderDetails && (
      <div className="order-modal">
        <div className="modal-content">
          <h2>Thank You for Ordering!</h2>
          <p>{orderDetails.message}</p>
          <p><strong>Order Token: {orderDetails.token}</strong></p>
          <p>Please show this token when picking up your order.</p>
          <button onClick={() => {
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
            navigate(`/invoice/${orderDetails.orderId}`);
          }}>
            View Invoice
          </button>
          <button onClick={() => { setShowModal(false); navigate("/myorders"); }}>Close</button>
          {orderDetails.paymentMethod === "COD" && (
            <p className="redirect-text">Redirecting to invoice...</p>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default PlaceOrder;
