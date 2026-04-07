import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cartRouter from "./routes/cartRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow all origins — safe for academic/demo projects.
// To restrict: set ALLOWED_ORIGINS="https://yourdomain.com,http://localhost:5173" in env
const rawOrigins = process.env.ALLOWED_ORIGINS;
const allowedOrigins = rawOrigins
  ? rawOrigins.split(",").map((o) => o.trim())
  : null; // null = allow all

app.use(
  cors({
    origin: (origin, callback) => {
      if (!allowedOrigins || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked: ${origin}`);
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lemonlime Cafeteria API is running 🚀",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/images", express.static("uploads"));


// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ─── Self-Ping (keeps Render free tier awake 24/7) ───────────────────────────
const SELF_URL =
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 4000}`;
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

const startPing = () => {
  setInterval(async () => {
    try {
      const res = await fetch(`${SELF_URL}/`);
      const data = await res.json();
      console.log(
        `[Ping] ✅ ${new Date().toISOString()} — alive: ${data.success}`
      );
    } catch (err) {
      console.error(`[Ping] ❌ Failed — ${err.message}`);
    }
  }, PING_INTERVAL_MS);
};

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 External URL: ${SELF_URL}`);
      console.log(`🔁 Self-ping every ${PING_INTERVAL_MS / 60000} min`);
      if (process.env.NODE_ENV === "production") {
        startPing();
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
