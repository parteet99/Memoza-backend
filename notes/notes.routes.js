const express = require("express");
const router = express.Router();
const { createNoteController, getUserNotes, updateNote, removeNote, archiveNote, favoriteNote, pinNote } = require("../notes/notes.controller");
const requireAuth = require("../middleware/auth.middleware");

router.post("/create-note", requireAuth, createNoteController);
router.get("/get-notes", requireAuth, getUserNotes);
router.post("/update-note", requireAuth, updateNote);
router.delete("/delete-note", requireAuth, removeNote);
router.post("/archive-note", requireAuth, archiveNote);
router.post("/favorite-note", requireAuth, favoriteNote);
router.post("/pin-note", requireAuth, pinNote);

module.exports = router;