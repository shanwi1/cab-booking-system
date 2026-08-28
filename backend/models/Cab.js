const mongoose = require("mongoose");

const cabSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  vehicleNumber: { type: String, required: true, unique: true, uppercase: true },
  vehicleModel: { type: String, required: true },
  cabType: {
    type: String,
    enum: ["Mini", "Sedan", "SUV", "Premium"],
    default: "Mini"
  },
  seats: { type: Number, default: 4 },
  pricePerKm: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Cab", cabSchema);
