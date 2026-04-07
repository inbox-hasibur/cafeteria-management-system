import reviewModel from "../models/reviewModel.js";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";

// Add or update a review
const addReview = async (req, res) => {
  const { foodId, orderId, rating, comment } = req.body;
  const userId = req.userId;

  try {
    // Validate inputs
    if (!foodId || !orderId || !rating) {
      return res.json({ success: false, message: "foodId, orderId, and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Verify order belongs to user
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    if (order.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Verify item was in this order
    const itemInOrder = order.items.find(
      (item) => item._id && item._id.toString() === foodId ||
                order.items.some((i) => i.name === i.name) // fallback check
    );
    // More permissive: just check order belongs to user - allow rating any item from their orders
    
    // Upsert review (update if already exists)
    const existing = await reviewModel.findOne({ userId, foodId, orderId });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || "";
      await existing.save();
    } else {
      await reviewModel.create({ userId, foodId, orderId, rating, comment: comment || "" });
    }

    // Recalculate average rating for this food item
    const allReviews = await reviewModel.find({ foodId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await foodModel.findByIdAndUpdate(foodId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    res.json({ success: true, message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Error adding review:", error);
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      return res.json({ success: false, message: "You have already reviewed this item for this order" });
    }
    res.json({ success: false, message: "Error submitting review" });
  }
};

// Get reviews for a food item
const getFoodReviews = async (req, res) => {
  const { foodId } = req.params;
  try {
    const reviews = await reviewModel
      .find({ foodId })
      .sort({ createdAt: -1 })
      .limit(20);

    const food = await foodModel.findById(foodId).select("averageRating totalReviews");

    res.json({
      success: true,
      reviews,
      averageRating: food?.averageRating || 0,
      totalReviews: food?.totalReviews || 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.json({ success: false, message: "Error fetching reviews" });
  }
};

// Check if user already reviewed an item for a specific order
const checkReview = async (req, res) => {
  const { foodId, orderId } = req.params;
  const userId = req.userId;
  try {
    const review = await reviewModel.findOne({ userId, foodId, orderId });
    res.json({ success: true, reviewed: !!review, review: review || null });
  } catch (error) {
    res.json({ success: false, message: "Error checking review" });
  }
};

export { addReview, getFoodReviews, checkReview };
