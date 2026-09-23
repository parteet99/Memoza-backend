const express = require("express");
const { loginUser, logoutUser, changePassword, forgotPassword, resetPassword } = require("./auth.controller");
const requireAuth = require("../middleware/auth.middleware");
const { forgotPasswordLimit, resetPasswordLimit, loginLimit } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/login", loginLimit, loginUser);
router.post("/logout", logoutUser);
router.put("/change-password", requireAuth, changePassword);
router.post("/forget-password", forgotPasswordLimit, forgotPassword);
router.post("/reset-password", resetPasswordLimit,resetPassword);

module.exports = router;
