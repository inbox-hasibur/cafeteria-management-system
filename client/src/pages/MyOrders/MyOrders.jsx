import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import api from "../../utils/api";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/orders/userorders");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

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
          <h1>Invoice</h1>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
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

  if (loading) {
    return <div className="my-orders"><p>Loading your orders...</p></div>;
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          data.map((order, index) => {
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
                <p>BDT {order.amount}</p>
                <p>Items: {order.items.length}</p>
                <p>
                  <span>&#x25cf;</span>
                  <b>{order.status}</b>
                </p>
                <button onClick={() => handlePrintInvoice(order)}>
                  Print Invoice
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
