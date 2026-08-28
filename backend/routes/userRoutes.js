const router = require("express").Router();
const { getUsers, updateRole } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), getUsers);
router.put("/:id/role", protect, authorize("admin"), updateRole);

module.exports = router;
