const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { verifyAdmin } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/users/names",
  verifyToken,
  verifyAdmin,
  authController.getUserNames
);

module.exports = router;
