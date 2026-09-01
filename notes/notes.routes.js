const express = require("express");
const router = express.Router();
const { createNoteController, getUserNotes, updateNote, removeNote } = require("../notes/notes.controller");
const requireAuth = require("../middleware/auth.middleware");

router.post("/create-note", requireAuth, createNoteController);
router.get("/get-notes", requireAuth, getUserNotes);
router.post("/update-note", requireAuth, updateNote);
router.delete("/delete-note", requireAuth, removeNote);

module.exports = router;