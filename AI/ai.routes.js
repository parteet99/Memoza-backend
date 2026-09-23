const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware")
const { summarizeNote } = require("./ai.controller");
const { aiLimit } = require("../middleware/rateLimiter");

router.post("/summarize", requireAuth, aiLimit, summarizeNote);

module.exports = router;