import React, { useEffect, useState } from "react";
import "./List.css";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { API_BASE } from "../../../utils/config";

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await api.get(`/api/food/list`);
      if (response.data.success) {
        setList(response.data.food);
      } else {
        toast.error("Error fetching list");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server Error");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await api.post(`/api/food/remove`, {
        id: foodId,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error("Error removing food");
      }
    } catch {
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Rating</b>
          <b>Action</b>
        </div>

        {list?.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={item.image && item.image.startsWith("http") ? item.image : API_BASE + "/images/" + item.image} alt={item.name} />
              <div className="item-details">
                <p className="item-name">{item.name}</p>
              </div>
              <p className="item-description">{item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description}</p>
              <p className="item-category">{item.category}</p>
              <p className="item-price">BDT {item.price}</p>
              <div className="item-rating">
                <span className="rating-stars">{'★'.repeat(Math.floor(item.averageRating))}</span>
                <span className="rating-value">({item.averageRating.toFixed(1)})</span>
                <p className="review-count">{item.totalReviews} reviews</p>
              </div>
              <button
                onClick={() => removeFood(item._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
};

export default List;
