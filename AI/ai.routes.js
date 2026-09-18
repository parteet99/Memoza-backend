const express = require("express")
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware")
const { summarizeNote } = require("./ai.controller");

router.post("/summarize", requireAuth, summarizeNote);

module.exports = router;