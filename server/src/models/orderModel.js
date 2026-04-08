import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "food" }, // optional ref for reviews
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    division: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    amount: { type: Number, required: true },
    address: { type: addressSchema, required: true },
    paymentMethod: {
      type: String,
      default: "COD",
      enum: ["COD", "Stripe", "bKash", "Nagad"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled"],
    },
    payment: { type: Boolean, default: false },
    token: { type: String, unique: true }, // Unique token for order pickup
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;