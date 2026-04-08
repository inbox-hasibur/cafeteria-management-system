import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import api from '../../utils/api';
import './Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const { token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/cart');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await api.post('/api/orders/userorders');
        const userOrders = response.data.data;
        const currentOrder = userOrders.find(o => o._id === orderId);
        if (currentOrder) {
          setOrder(currentOrder);
        } else {
          navigate('/myorders');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        navigate('/myorders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, navigate]);

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return <div className="invoice-loading">Loading invoice...</div>;
  }

  if (!order) {
    return <div className="invoice-error">Order not found.</div>;
  }

  return (
    <div className="invoice">
      <div className="invoice-header">
        <h1>Lemonlime Cafeteria</h1>
        <p>Invoice</p>
      </div>

      <div className="invoice-details">
        <div className="order-info">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Token:</strong> {order.token}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="customer-info">
          <h3>Customer Information</h3>
          <p>{order.address.firstName} {order.address.lastName}</p>
          <p>{order.address.street}, {order.address.city}</p>
          <p>{order.address.division}, {order.address.zipCode}</p>
          <p>{order.address.country}</p>
          <p>{order.address.phone}</p>
          <p>{order.address.email}</p>
        </div>
      </div>

      <div className="invoice-items">
        <h3>Items Ordered</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>BDT {item.price}</td>
                <td>BDT {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="invoice-total">
        <p><strong>Subtotal:</strong> BDT {order.amount - 70}</p>
        <p><strong>Delivery Fee:</strong> BDT 70</p>
        <p><strong>Total:</strong> BDT {order.amount}</p>
      </div>

      <div className="invoice-actions">
        <button onClick={printInvoice} className="print-btn">Print Invoice</button>
        <button onClick={() => navigate('/myorders')} className="back-btn">Back to Orders</button>
      </div>
    </div>
  );
};

export default Invoice;