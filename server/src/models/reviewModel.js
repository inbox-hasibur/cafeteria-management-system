import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      maxlength: [500, "Comment cannot exceed 500 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// One review per food per order per user
reviewSchema.index({ userId: 1, foodId: 1, orderId: 1 }, { unique: true });

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
