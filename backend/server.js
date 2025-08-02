import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import postsRoutes from "./routes/posts.routes.js";

dotenv.config();
const app = express();

// Middleware - must come before routes
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/posts", postsRoutes);

// Optional root route
app.get("/", (req, res) => {
  res.send("Welcome to Connective API");
});

// Connect to DB and start server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(9000, () => {
      console.log("Server is running on port 9000");
    });
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

start();
