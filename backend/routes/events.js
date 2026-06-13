const express = require("express");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category, date, organizerId } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (date) filter.date = { $gte: new Date(date) };
    if (organizerId) filter.organizer = organizerId;

    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email",
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("organizer", "name email"); // ← add this

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // allow if admin OR the organizer
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
