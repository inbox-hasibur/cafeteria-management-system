import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img shimmer"></div>
    <div className="skeleton-info">
      <div className="skeleton-title shimmer"></div>
      <div className="skeleton-desc shimmer"></div>
      <div className="skeleton-price shimmer"></div>
    </div>
  </div>
);

const FoodDisplay = () => {
  const { food_list, category, setCategory, loading, searchQuery, setSearchQuery } = useContext(StoreContext);

  const filteredFoods = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const searchLower = (searchQuery || "").toLowerCase();
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchLower) ||
      (item.description || "").toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>Top Dishes Near You</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="food-display-list">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <>
          <div className="food-display-list">
            {filteredFoods.map((item) => (
              <div key={item._id} className="fade-in">
                <FoodItem
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  rating={item.averageRating || 0}
                  totalReviews={item.totalReviews || 0}
                />
              </div>
            ))}
          </div>

          {!loading && food_list.length > 0 && filteredFoods.length === 0 && (
            <div className="empty-state">
              <h3>No dishes match your search or category.</h3>
              <p>Try adjusting your filters or search query.</p>
              <button
                className="reset-btn"
                onClick={() => { setSearchQuery(""); setCategory("All"); }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {!loading && food_list.length === 0 && (
            <div className="empty-state">
              <h3>Our menu is coming soon!</h3>
              <p>We are preparing delicious meals for you.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoodDisplay;
