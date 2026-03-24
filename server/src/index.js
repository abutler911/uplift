require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3002;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
  }),
);

app.use(express.json());

// Public routes
app.use("/api/auth", authRouter);
app.get("/api/posts/public", require("./routes/posts").publicHandler);
app.get(
  "/api/posts/public/:slug",
  require("./routes/posts").publicSingleHandler,
);

// Protected routes
app.use("/api", authMiddleware);
app.use("/api/posts", postsRouter);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
