const router = require("express").Router();

const {
  createBooking,
  myBookings,
  driverBookings,
  allBookings,
  updateStatus,
  cancelBooking,
  assignDriver
} = require("../controllers/bookingController");

const {
  protect,
  authorize
} = require("../middleware/auth");

router.post(
  "/",
  protect,
  authorize("customer"),
  createBooking
);

router.get(
  "/my",
  protect,
  authorize("customer"),
  myBookings
);

router.get(
  "/driver",
  protect,
  authorize("driver"),
  driverBookings
);

router.get(
  "/",
  protect,
  authorize("admin"),
  allBookings
);
router.put(
  "/:id/driver",
  protect,
  authorize("admin"),
  assignDriver
);

router.put(
  "/:id/status",
  protect,
  authorize("driver", "admin"),
  updateStatus
);

router.put(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelBooking
);

module.exports = router;