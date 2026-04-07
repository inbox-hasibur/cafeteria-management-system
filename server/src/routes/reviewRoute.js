import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addReview, getFoodReviews, checkReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authMiddleware, addReview);
reviewRouter.get("/food/:foodId", getFoodReviews);
reviewRouter.get("/check/:foodId/:orderId", authMiddleware, checkReview);

export default reviewRouter;
