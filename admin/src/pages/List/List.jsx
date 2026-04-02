import React, { useEffect, useState } from "react";
import "./List.css";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { API_BASE } from "../../utils/config";

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await api.get(`/api/food/list`);
      console.log("Fetched List Data:", response.data); // Debugging response

      if (response.data.success) {
        setList(response.data.food); // Update the state with fetched data
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
      await fetchList(); // Refetch the list after removal

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch {
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList(); // Call the fetch function when the component mounts
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list?.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={`${API_BASE}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>BDT {item.price}</p>
              <button
                onClick={() => removeFood(item._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No items found.</p> // Show this if list is empty
        )}
      </div>
    </div>
  );
};

export default List;
