const express = require("express");
const router = express.Router();
const { noteCount, archiveCount, folderCount, trashCount, pinnedNotes, recentlyUpdatedNotes } = require("./dashboard.controller");
const requireAuth = require("../middleware/auth.middleware")

router.use(requireAuth);

router.get("/note-count", noteCount);
router.get("/folder-count", folderCount);
router.get("/archive-count", archiveCount);
router.get("/trash-count", trashCount);
router.get("/pinned-note", pinnedNotes);
router.get("/recentUpdated-note", recentlyUpdatedNotes);

module.exports = router

