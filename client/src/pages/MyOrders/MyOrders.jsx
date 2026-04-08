import React, { useContext, useEffect, useState, useCallback } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import api from "../../utils/api";
import { toast } from "react-toastify";

// Star picker component
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`pick-star ${star <= (hovered || value) ? "active" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Inline rating form for a single item in an order
const RatingForm = ({ item, orderId, onSuccess, existingReview }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warning("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await api.post("/api/review/add", {
        foodId: item.foodId,
        orderId,
        rating,
        comment,
      });
      if (response.data.success) {
        toast.success("Review submitted! Thank you.");
        onSuccess(item.foodId, rating);
      } else {
        toast.error(response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("Error submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <p className="rating-item-name">Rate: <strong>{item.name}</strong></p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        className="rating-comment"
        placeholder="Share your experience (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={500}
        rows={2}
      />
      <button type="submit" className="rating-submit-btn" disabled={submitting}>
        {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
};

const MyOrders = () => {
  const { token, fetchFoodList } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [ratingItem, setRatingItem] = useState(null); // { orderId, item }
  const [submittedRatings, setSubmittedRatings] = useState({}); // { `${orderId}_${foodId}`: rating }
  const [existingReviews, setExistingReviews] = useState({}); // { `${orderId}_${foodId}`: review }

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/orders/userorders");
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  useEffect(() => {
    const hydrateReviews = async () => {
      if (!token || data.length === 0) return;

      const deliveredItems = data.flatMap((order) =>
        order.status === "Delivered"
          ? order.items
              .filter((item) => item.foodId)
              .map((item) => ({ orderId: order._id, foodId: item.foodId }))
          : []
      );

      if (deliveredItems.length === 0) return;

      try {
        const checks = await Promise.all(
          deliveredItems.map(({ orderId, foodId }) =>
            api.get(`/api/review/check/${foodId}/${orderId}`)
          )
        );

        const ratingMap = {};
        const reviewMap = {};

        checks.forEach((res, idx) => {
          const payload = res.data;
          if (payload.success && payload.reviewed && payload.review) {
            const { orderId, foodId } = deliveredItems[idx];
            const key = `${orderId}_${foodId}`;
            ratingMap[key] = payload.review.rating;
            reviewMap[key] = payload.review;
          }
        });

        setSubmittedRatings((prev) => ({ ...prev, ...ratingMap }));
        setExistingReviews((prev) => ({ ...prev, ...reviewMap }));
      } catch (error) {
        console.error("Error loading existing reviews:", error);
      }
    };

    hydrateReviews();
  }, [data, token]);

  const handleRatingSuccess = async (foodId, rating) => {
    const key = `${ratingItem?.orderId}_${foodId}`;
    setSubmittedRatings((prev) => ({ ...prev, [key]: rating }));
    setExistingReviews((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        rating,
      },
    }));
    setRatingItem(null);
    // Refresh food list so average ratings update on home page
    await fetchFoodList();
  };

  const handlePrintInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank");
    const invoiceContent = `
      <html>
        <head>
          <title>Invoice — ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            h1 { text-align: center; color: #7ebf08; margin-bottom: 5px; }
            .subtitle { text-align: center; color: #888; margin-bottom: 25px; font-size: 13px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
            th { background-color: #f4f9e8; color: #555; }
            .total-row td { font-weight: bold; background: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; color: #aaa; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>IUBAT Lemonlime Cafeteria</h1>
          <p class="subtitle">Order Invoice</p>
          <div class="info-row"><span><strong>Order ID:</strong> ${order._id}</span><span><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</span></div>
          <div class="info-row"><span><strong>Status:</strong> ${order.status}</span><span><strong>Payment:</strong> ${order.paymentMethod || "COD"}</span></div>
          <table>
            <thead>
              <tr><th>Item</th><th>Unit Price</th><th>Qty</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>BDT ${item.price}</td>
                  <td>${item.quantity}</td>
                  <td>BDT ${item.price * item.quantity}</td>
                </tr>
              `).join("")}
              <tr><td colspan="3">Delivery Fee</td><td>BDT 70</td></tr>
            </tbody>
            <tfoot>
              <tr class="total-row"><td colspan="3">Grand Total</td><td>BDT ${order.amount}</td></tr>
            </tfoot>
          </table>
          <div class="footer">Thank you for ordering from IUBAT Lemonlime Cafeteria!</div>
        </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  const getStatusColor = (status) => {
    const colors = {
      "Pending": "#f59e0b",
      "Processing": "#3b82f6",
      "Out for Delivery": "#8b5cf6",
      "Delivered": "#10b981",
      "Cancelled": "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  if (!token) {
    return (
      <div className="my-orders">
        <div className="orders-empty">
          <h3>Please log in to view your orders.</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="orders-loading">
          {[1, 2, 3].map((n) => (
            <div key={n} className="order-skeleton shimmer-order"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="orders-header">
        <h2>My Orders</h2>
        <button className="refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
      </div>

      <div className="orders-container">
        {data.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">🧺</div>
            <h3>No orders yet!</h3>
            <p>Start exploring our menu and place your first order.</p>
          </div>
        ) : (
          data.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const isDelivered = order.status === "Delivered";

            return (
              <div key={order._id} className="order-card">
                {/* Order Header */}
                <div
                  className="order-card-header"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="order-card-left">
                    <div className="order-icon">📦</div>
                    <div className="order-summary">
                      <p className="order-items-summary">
                        {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                      </p>
                      <p className="order-meta">
                        {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                        <strong>BDT {order.amount}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="order-card-right">
                    <span
                      className="order-status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) + "22", color: getStatusColor(order.status) }}
                    >
                      ● {order.status}
                    </span>
                    <span className="order-toggle">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="order-card-body">
                    <div className="order-details-grid">
                      <div>
                        <p className="detail-label">Payment</p>
                        <p className="detail-value">{order.paymentMethod || "COD"}</p>
                      </div>
                      <div>
                        <p className="detail-label">Order ID</p>
                        <p className="detail-value order-id-text">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="order-items-list">
                      {order.items.map((item, idx) => {
                        const ratingKey = `${order._id}_${item.foodId || idx}`;
                        const alreadyRated = submittedRatings[ratingKey];
                        const isRatingThis =
                          ratingItem?.orderId === order._id &&
                          ratingItem?.item?.foodId === item.foodId;

                        return (
                          <div key={idx} className="order-item-row">
                            <div className="order-item-info">
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-qty">×{item.quantity}</span>
                              <span className="order-item-price">BDT {item.price * item.quantity}</span>
                            </div>

                            {isDelivered && item.foodId && (
                              <button
                                className={`rate-btn ${alreadyRated ? "rated" : ""}`}
                                onClick={() =>
                                  setRatingItem(
                                    isRatingThis
                                      ? null
                                      : { orderId: order._id, item }
                                  )
                                }
                              >
                                {alreadyRated
                                  ? `★ ${alreadyRated}/5 Rated`
                                  : isRatingThis
                                  ? "✕ Cancel"
                                  : "☆ Rate"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Rating Form */}
                    {ratingItem && ratingItem.orderId === order._id && (
                      <RatingForm
                        item={ratingItem.item}
                        orderId={order._id}
                        onSuccess={handleRatingSuccess}
                        existingReview={existingReviews[`${order._id}_${ratingItem.item.foodId}`]}
                      />
                    )}

                    {/* Action Buttons */}
                    <div className="order-actions">
                      <button
                        className="invoice-btn"
                        onClick={() => handlePrintInvoice(order)}
                      >
                        🖨 Print Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
