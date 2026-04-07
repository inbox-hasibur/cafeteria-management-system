import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name cannot exceed 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [10000, "Price cannot exceed 10000"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Biryani",
        "Rice",
        "Curry",
        "Fish",
        "Shawarma",
        "Sandwich",
        "Special",
        "Vegetable",
        "Beverage",
      ],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;