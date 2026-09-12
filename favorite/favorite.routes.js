const { getStarNotes } = require("./favorite.controller");
const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");

router.get("/starred-note", requireAuth, getStarNotes);

module.exports = router
