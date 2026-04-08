import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const DELIVERY_FEE = 70; // BDT

// Initialize Stripe only if key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Place order from frontend
const placeOrder = async (req, res) => {
  const { items, amount, address, paymentMethod = "COD" } = req.body;
  const frontend_url = process.env.STRIPE_FRONTEND_URL || "http://localhost:5173";

  try {
    // Validate items
    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in order" });
    }

    // Generate unique token
    let token;
    do {
      token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit token
    } while (await orderModel.findOne({ token }));

    // 1. Create order in Database
    const newOrder = new orderModel({
      userId: req.userId,
      items: items.map(item => ({
        foodId: item.foodId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      amount: amount,
      address: address,
      paymentMethod: paymentMethod,
      payment: false, // always false initially; updated after payment confirmed
      token: token,
    });

    await newOrder.save();

    // 2. Clear user cart in DB
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    // 3. Handle Cash on Delivery and other offline methods — mark payment as "pending on delivery"
    if (paymentMethod === "COD" || paymentMethod === "bKash" || paymentMethod === "Nagad") {
      // For these methods, payment happens directly so we keep payment: false
      // but return success so frontend can navigate to MyOrders
      return res.json({
        success: true,
        message: `Order placed successfully! Please pay via ${paymentMethod}.`,
        orderId: newOrder._id,
        token: newOrder.token,
      });
    }

    if (!stripe) {
      return res.json({
        success: false,
        message: "Stripe is not configured. Please use another payment method."
      });
    }

    // 4. Handle Stripe Payment
    const line_items = items.map((item) => ({
      price_data: {
        currency: "bdt",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "bdt",
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(DELIVERY_FEE * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.json({ success: false, message: error.message || "Error placing order" });
  }
};

// Verify Stripe payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment cancelled. Order removed." });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// Get user's orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// Get all orders (admin)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error listing orders:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// Update order status (admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Status updated successfully!" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};

export { listOrders, placeOrder, updateStatus, userOrders, verifyOrder };
