const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cab: { type: mongoose.Schema.Types.ObjectId, ref: "Cab", required: true },
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true },
  fare: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
