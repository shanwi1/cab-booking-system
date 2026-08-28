const Booking = require("../models/Booking");
const Cab = require("../models/Cab");
const User = require("../models/User");
exports.createBooking = async (req, res, next) => {
  try {
    const { cabId, pickup, destination, distance } = req.body;

    if (!cabId || !pickup || !destination || !distance) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    const cab = await Cab.findById(cabId);
    if (!cab) return res.status(404).json({ message: "Cab not found" });
    if (!cab.isAvailable) {
      return res.status(400).json({ message: "Cab is not available" });
    }

    const fare = Number(distance) * Number(cab.pricePerKm);

    const booking = await Booking.create({
      customer: req.user._id,
      cab: cab._id,
      pickup,
      destination,
      distance,
      fare
    });

    cab.isAvailable = false;
    await cab.save();

    const populated = await booking.populate([
      { path: "customer", select: "name email phone" },
      { path: "cab", populate: { path: "driver", select: "name phone" } }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

exports.myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("cab")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.driverBookings = async (req, res, next) => {
  try {
    const cabs = await Cab.find({ driver: req.user._id }).select("_id");
    const cabIds = cabs.map(c => c._id);

    const bookings = await Booking.find({ cab: { $in: cabIds } })
      .populate("customer", "name email phone")
      .populate("cab")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.allBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone")
      .populate("cab")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const allowed = ["accepted", "ongoing", "completed", "cancelled"];
    const { status } = req.body;

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id).populate("cab");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role === "driver") {
      if (!booking.cab.driver || String(booking.cab.driver) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not your booking" });
      }
    }

    booking.status = status;
    await booking.save();

    if (["completed", "cancelled"].includes(status)) {
      await Cab.findByIdAndUpdate(booking.cab._id, { isAvailable: true });
    }

    const updated = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("cab");

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your booking" });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();
    await Cab.findByIdAndUpdate(booking.cab, { isAvailable: true });

    res.json(booking);
  } catch (error) {
    next(error);
  }
};
exports.assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({
        message: "Driver is required"
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const driver = await User.findById(driverId);

    if (!driver || driver.role !== "driver") {
      return res.status(400).json({
        message: "Invalid driver"
      });
    }

    // Assign driver to the cab
    await Cab.findByIdAndUpdate(
      booking.cab,
      { driver: driver._id }
    );

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate({
        path: "cab",
        populate: {
          path: "driver",
          select: "name email phone"
        }
      });

    res.json(updatedBooking);

  } catch (error) {
    next(error);
  }
};