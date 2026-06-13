const express = require("express");
const RSVP = require("../models/RSVP");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { eventId, userId } = req.query;
    const filter = {};
    if (eventId) filter.event = eventId;
    if (userId) filter.user = userId;

    const rsvps = await RSVP.find(filter)
      .populate("user", "name email")
      .populate("event", "title date city category");

    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    // check if user already RSVP'd to this event
    const existing = await RSVP.findOne({
      user: req.user.id,
      event: req.body.event,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already RSVP'd to this event" });
    }
    const rsvp = await RSVP.create({ ...req.body, user: req.user.id });
    res.status(201).json(rsvp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const rsvp = await RSVP.findById(req.params.id);
    if (!rsvp) return res.status(404).json({ message: "RSVP not found" });

    // only the rsvp owner can edit it
    if (rsvp.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await RSVP.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
