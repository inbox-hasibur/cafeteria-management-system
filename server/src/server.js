import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cartRouter from "./routes/cartRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.STRIPE_FRONTEND_URL, // production Vercel URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Lemonlime Cafeteria API is running 🚀" });
});

// ─── API Endpoints ───────────────────────────────────────────────────────────
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// ─── Self-Ping (keeps Render free tier awake 24/7) ───────────────────────────
const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 4000}`;
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15m)

const startPing = () => {
  setInterval(async () => {
    try {
      const res = await fetch(`${SELF_URL}/`);
      const data = await res.json();
      console.log(`[Ping] Server alive ✅ — ${new Date().toISOString()} | status: ${data.success}`);
    } catch (err) {
      console.error(`[Ping] Failed to ping server ❌ — ${err.message}`);
    }
  }, PING_INTERVAL_MS);
};

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at ${SELF_URL}`);
      console.log(`🔁 Self-ping active every ${PING_INTERVAL_MS / 60000} minutes`);
      startPing(); // start after server is listening
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

