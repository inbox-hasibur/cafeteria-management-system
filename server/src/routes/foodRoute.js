import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const foodRouter = express.Router();

// Cloudinary connection is auto-configured via CLOUDINARY_URL in .env

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lemonlime-foods", // Folder name in Cloudinary
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.put("/update/:id", upload.single("image"), updateFood);

export default foodRouter;