const express = require("express");
const { loginUser, logoutUser } = require("./auth.controller");
// const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
