import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
  const { food_list, category, loading } = useContext(StoreContext);

  if (loading) {
    return (
      <div className="food-display" id="food-display">
        <h2>Top dishes near you</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
      {food_list.length > 0 && !food_list.some(item => category === "All" || category === item.category) && (
        <p className="no-items-message">No dishes found in this category.</p>
      )}
      {food_list.length === 0 && (
        <p className="no-items-message">Our menu is coming soon!</p>
      )}
    </div>
  );
};

export default FoodDisplay;
