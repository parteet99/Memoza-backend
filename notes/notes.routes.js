const express = require("express");
const router = express.Router();
const { createNoteController } = require("../notes/notes.controller");
const requireAuth = require("../middleware/auth.middleware");

router.post("/create-note", requireAuth, createNoteController)

module.exports = router;