// seed.js — Run once to populate the DB with sample food items
// Usage: node seed.js

import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import foodModel from "./src/models/foodModel.js";

const SAMPLE_FOODS = [
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice cooked with tender chicken, spices & saffron. A royal Bengali feast.",
    price: 180,
    category: "Biryani",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51c?w=400&q=80",
  },
  {
    name: "Mutton Biryani",
    description: "Slow-cooked juicy mutton with fragrant rice and whole spices. Rich and satisfying.",
    price: 250,
    category: "Biryani",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  },
  {
    name: "Plain Rice",
    description: "Fluffy white rice, perfectly steamed. Best paired with any curry.",
    price: 40,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80",
  },
  {
    name: "Khichuri",
    description: "Classic Bengali comfort food — rice and lentils cooked together with spices.",
    price: 70,
    category: "Rice",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80",
  },
  {
    name: "Chicken Curry",
    description: "Tender chicken pieces in a rich, spiced gravy. Goes perfectly with rice or roti.",
    price: 130,
    category: "Curry",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  },
  {
    name: "Dal Curry",
    description: "Creamy lentil curry tempered with mustard seeds and garlic. A daily staple.",
    price: 60,
    category: "Curry",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  },
  {
    name: "Hilsa Fish Curry",
    description: "Beloved ilish mach cooked in mustard gravy — the taste of Bangladesh.",
    price: 200,
    category: "Fish",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  },
  {
    name: "Rohu Fish Fry",
    description: "Crispy golden-fried rui fish marinated with turmeric and chilli. Crunchy delight.",
    price: 120,
    category: "Fish",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  },
  {
    name: "Chicken Shawarma",
    description: "Lebanese-style grilled chicken wrapped in soft bread with garlic sauce and veggies.",
    price: 110,
    category: "Shawarma",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80",
  },
  {
    name: "Beef Shawarma",
    description: "Juicy beef strips with fresh herbs, tahini, and pickles in a warm wrap.",
    price: 140,
    category: "Shawarma",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
  },
  {
    name: "Club Sandwich",
    description: "Triple-layered toasted sandwich with chicken, cheese, lettuce, and tomato.",
    price: 90,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  },
  {
    name: "Egg Sandwich",
    description: "Fresh egg omelette sandwich with veggies on soft toasted bread.",
    price: 50,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1485451456034-3f9391c6f769?w=400&q=80",
  },
  {
    name: "Chef's Special Platter",
    description: "Handpicked selection of the day's best dishes — a true chef's masterpiece.",
    price: 350,
    category: "Special",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  },
  {
    name: "Mixed Vegetable Stir-fry",
    description: "Seasonal vegetables sautéed with garlic and light spices. Healthy and delicious.",
    price: 70,
    category: "Vegetable",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    name: "Mango Lassi",
    description: "Chilled yogurt blended with sweet alphonso mango. Refreshing and creamy.",
    price: 60,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1568171812-43f7b82b9cf5?w=400&q=80",
  },
  {
    name: "Lemon Mint Cooler",
    description: "Fresh lemon juice with crushed mint and a hint of sugar. Perfect for hot days.",
    price: 45,
    category: "Beverage",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected");

    const existing = await foodModel.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  DB already has ${existing} food items. Skipping seed.`);
      console.log("   Run with --force to override: node seed.js --force");
      if (!process.argv.includes("--force")) {
        process.exit(0);
      }
      await foodModel.deleteMany({});
      console.log("🗑️  Cleared existing food items.");
    }

    await foodModel.insertMany(SAMPLE_FOODS);
    console.log(`🎉 Successfully seeded ${SAMPLE_FOODS.length} food items!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
