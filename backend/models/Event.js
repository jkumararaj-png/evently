const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    date: { type: Date, required: [true, "Date is required"] },
    venue: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "Music",
        "Sports",
        "Competition",
        "Arts",
        "Food & Drink",
        "Community",
        "Other",
      ],
      default: "Other",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventImg: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
