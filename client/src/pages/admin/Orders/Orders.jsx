import React, { useEffect, useState } from "react";
import "./Orders.css";
import { assets } from "../../../assets/assets";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders/list");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (event, orderId) => {
    try {
      const res = await api.put("/api/orders/status", {
        orderId,
        status: event.target.value,
      });
      if (res.data.success) {
        toast.success("Order status updated!");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handlePrintInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank");
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .total { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Customer Invoice</h1>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Token:</strong> ${order.token}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${order.address.firstName} ${order.address.lastName}</p>
          <p><strong>Phone:</strong> ${order.address.phone}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>BDT ${item.price}</td>
                  <td>${item.quantity}</td>
                  <td>BDT ${item.price * item.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total Amount: BDT ${order.amount}</p>
        </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  return (
    <div className="my-orders">
      <h2>All Orders</h2>
      <div className="container">
        {data.length === 0 ? <p>No orders yet.</p> : null}
        {data.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p className="order-items">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>BDT {order.amount}</p>
              <p>Items: {order.items.length}</p>
              <p><strong>Token: {order.token}</strong></p>
              
              <div className="status-container">
                <select 
                  onChange={(e) => updateOrderStatus(e, order._id)} 
                  value={order.status}
                  className="status-dropdown"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <button className="print-btn" onClick={() => handlePrintInvoice(order)}>Print Invoice</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
