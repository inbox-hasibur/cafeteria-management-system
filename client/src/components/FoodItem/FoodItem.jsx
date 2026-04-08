import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { API_BASE } from "../../utils/config";

const StarRating = ({ rating, totalReviews }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="food-item-rating">
      <div className="stars">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= Math.round(rating) ? "filled" : "empty"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="rating-count">
        {rating > 0 ? `${rating.toFixed(1)} (${totalReviews})` : ""}
      </span>
    </div>
  );
};

const FoodItem = ({ id, name, price, description, image, rating = 0, totalReviews = 0 }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  const imgSrc = image && image.startsWith("http")
    ? image
    : `${API_BASE}/images/${image}`;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={imgSrc}
          alt={name}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-bottom">
          <p className="food-item-price">BDT {price}</p>
          <StarRating rating={rating} totalReviews={totalReviews} />
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
