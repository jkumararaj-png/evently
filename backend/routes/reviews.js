const express = require("express");
const Review = require("../models/Review");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { eventId, userId } = req.query;
    const filter = {};
    if (eventId) filter.event = eventId;
    if (userId) filter.user = userId;

    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("event", "title date city");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user.id });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
