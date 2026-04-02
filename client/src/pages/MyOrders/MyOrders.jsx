import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import api from "../../utils/api";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders/userorders");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Static data fallback
  const staticData = [
    {
      id: 1,
      items: [
        { name: "Item A", quantity: 2 },
        { name: "Item B", quantity: 1 },
      ],
      amount: 50,
      status: "Delivered",
    },
    {
      id: 2,
      items: [
        { name: "Item C", quantity: 3 },
        { name: "Item D", quantity: 2 },
      ],
      amount: 75,
      status: "Processing",
    },
  ];

  const orders = data.length > 0 ? data : staticData;

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
          <p><strong>Status:</strong> ${order.status}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total Amount: $${order.amount}.00</p>
        </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders?.map((order, index) => {
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
              <p>${order.amount}.00</p>
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
        })}
      </div>
    </div>
  );
};

export default MyOrders;
