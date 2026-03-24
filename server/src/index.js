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
  }),
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Auth — unprotected
app.use("/api/auth", authRouter);

// Public post routes — unprotected
app.get("/api/posts/public", postsRouter.publicHandler);
app.get("/api/posts/public/:slug", postsRouter.publicSingleHandler);

// Protected routes
app.use("/api/posts", authMiddleware, postsRouter);

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
