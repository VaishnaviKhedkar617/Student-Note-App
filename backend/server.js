const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Student Task Planner API is running",
  });
});

// ===============================
// Task Routes
// ===============================

app.use("/api/tasks", taskRoutes);

// ===============================
// Error Handling Middleware
// ===============================

app.use(errorMiddleware);

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

