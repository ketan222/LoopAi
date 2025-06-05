const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const ingestRoutes = require("./routes/ingestRoutes.js");
const statusRoutes = require("./routes/statusRoutes.js");

// Import job processor
const jobProcessor = require("./services/jobProcessor.js");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", ingestRoutes);
app.use("/", statusRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the job processor
    jobProcessor.start();

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});
