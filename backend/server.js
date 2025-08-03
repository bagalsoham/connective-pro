import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
// ⬅️ This middleware must be placed before route handlers 
// because it parses incoming JSON request bodies into JS objects.
// If you place it after routes, `req.body` will be undefined in your POST/PUT requests.

// Routes
app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);
app.use(express.static("uploads"));//relative path is stored

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Connective API");
});

// Start the server
const start = async () => {
  try {
    // Remove deprecated options - they're no longer needed
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(9000, () => {
      console.log("Server is running on port 9000");
    });
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

start();