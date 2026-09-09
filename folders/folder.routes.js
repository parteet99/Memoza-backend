const express = require("express");
const router = express.Router();   
const requireAuth = require("../middleware/auth.middleware");
const { createNewFolder, getFolder, getfolderById, updateFolderName, deletefolder, noteToFolder, notesByFolder } = require("./folder.controller");

router.get("/get-folders", requireAuth, getFolder);
router.post("/create-new-folder", requireAuth, createNewFolder);
router.get("/get-folder", requireAuth, getfolderById);
router.put("/update-folder", requireAuth, updateFolderName);
router.delete("/delete-folder", requireAuth, deletefolder);
router.put("/move-to-folder", requireAuth, noteToFolder);
router.get("/get-folder-notes", requireAuth, notesByFolder);

module.exports = router;

