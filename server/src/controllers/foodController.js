import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add food item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file.path, // Cloudinary provides full URL in path
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully!" });
  } catch (error) {
    console.error("Error adding food:", error);
    res.json({ success: false, message: error.message || "Error adding food" });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.json({ success: true, food });
  } catch (error) {
    console.error("Error listing food:", error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// Helper function to extract public_id from Cloudinary URL
const getCloudinaryPublicId = (url) => {
  try {
    const splitUrl = url.split("/");
    const lastPart = splitUrl[splitUrl.length - 1];
    return "lemonlime-foods/" + lastPart.split(".")[0];
  } catch {
    return null;
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    // Delete image from Cloudinary
    if (food.image && food.image.includes("res.cloudinary.com")) {
      const publicId = getCloudinaryPublicId(food.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully!" });
  } catch (error) {
    console.error("Error removing food:", error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
    };

    // If a new image was uploaded, update it and delete old one from Cloudinary
    if (req.file) {
      const existingFood = await foodModel.findById(id);
      if (existingFood && existingFood.image && existingFood.image.includes("res.cloudinary.com")) {
        const publicId = getCloudinaryPublicId(existingFood.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      updates.image = req.file.path;
    }

    const food = await foodModel.findByIdAndUpdate(id, updates, { new: true });
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, message: "Food updated successfully!", food });
  } catch (error) {
    console.error("Error updating food:", error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, updateFood };