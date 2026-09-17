const express = require("express");
const router = express.Router();
const { createNoteController, getUserNotes, updateNote, removeNote, archiveNote, favoriteNote, pinNote, trashNotes, permanentDeleteNote, archiveNoteList, restoreTrash } = require("../notes/notes.controller");
const requireAuth = require("../middleware/auth.middleware");

router.post("/create-note", requireAuth, createNoteController);
router.get("/get-notes", requireAuth, getUserNotes);
router.post("/update-note", requireAuth, updateNote);
router.post("/delete-note", requireAuth, removeNote);
router.post("/archive-note", requireAuth, archiveNote);
router.get("/get-archive-note", requireAuth, archiveNoteList);
router.post("/favorite-note", requireAuth, favoriteNote);
router.post("/pin-note", requireAuth, pinNote);
router.get("/trash-notes", requireAuth, trashNotes);
router.post("/restore-note", requireAuth, restoreTrash);
router.delete("/permanent-delete", requireAuth, permanentDeleteNote);

module.exports = router;