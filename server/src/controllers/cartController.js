import userModel from "../models/userModel.js";

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    const { itemId } = req.body;

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    const { itemId } = req.body;

    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    // Clean up zero-quantity items
    if (cartData[itemId] <= 0) {
      delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// Get cart data
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.json({ success: false, message: "Error clearing cart" });
  }
};

export { addToCart, removeFromCart, getCart, clearCart };
