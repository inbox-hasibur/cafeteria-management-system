import React, { useEffect, useState } from "react";
import "./Orders.css";
import { assets } from "../../assets/assets";
import api from "../../utils/api";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await api.get("/api/orders/list");
    setData(response.data.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const approveOrder = async (order) => {
    try {
      const res = await api.put("/api/orders/status", {
        orderId: order._id,
        status: "Approved",
      });
      if (res.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>BDT {order.amount}.00</p>
              <p>Items: {order.items.lenght}</p>
              <p style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <span>&#x25cf;</span>
                <b>{order.status}</b>
                {order.status === "Pending" && (
                  <button onClick={() => approveOrder(order)}>Approve</button>
                )}
              </p>
              <button>Print Invoice</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
