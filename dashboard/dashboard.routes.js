const express = require("express");
const router = express.Router();
const { noteCount, archiveCount, folderCount, trashCount } = require("./dashboard.controller");
const requireAuth = require("../middleware/auth.middleware")

router.use(requireAuth);

router.get("/note-count", noteCount);
router.get("/folder-count", folderCount);
router.get("/archive-count", archiveCount);
router.get("/trash-count", trashCount);

module.exports = router

