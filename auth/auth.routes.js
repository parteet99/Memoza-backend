const express = require("express");
const { loginUser, logoutUser, changePassword } = require("./auth.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/change-password", requireAuth, changePassword);

module.exports = router;
