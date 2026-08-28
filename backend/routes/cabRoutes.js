const router = require("express").Router();

const {
  getCabs,
  getCab,
  createCab,
  updateCab,
  deleteCab,
  assignDriver
} = require("../controllers/cabController");

const {
  protect,
  authorize
} = require("../middleware/auth");


router.get("/", getCabs);

router.get("/:id", getCab);


router.post(
  "/",
  protect,
  authorize("admin"),
  createCab
);


// Assign driver to cab
router.put(
  "/:id/driver",
  protect,
  authorize("admin"),
  assignDriver
);


// Update cab
router.put(
  "/:id",
  protect,
  authorize("admin", "driver"),
  updateCab
);


router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCab
);


module.exports = router;