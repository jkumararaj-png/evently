const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["going", "maybe", "not going"],
      default: "going",
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

rsvpSchema.index({ user: 1, event: 1 }, { unique: true });
module.exports = mongoose.model("RSVP", rsvpSchema);
