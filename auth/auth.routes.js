const express = require("express");
const { loginUser, logoutUser, changePassword, forgotPassword, resetPassword } = require("./auth.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/change-password", requireAuth, changePassword);
router.post("/forget-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
