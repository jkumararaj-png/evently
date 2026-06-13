const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Evently API is running" });
});

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Events routes
const eventRoutes = require("./routes/events");
app.use("/api/events", eventRoutes);

// RSVPs & Reviews routes
const rsvpRoutes = require("./routes/rsvps");
const reviewRoutes = require("./routes/reviews");

app.use("/api/rsvps", rsvpRoutes);
app.use("/api/reviews", reviewRoutes);

// Users routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Connection error:", err));
