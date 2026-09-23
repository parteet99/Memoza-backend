const express = require("express");
const router = express.Router();
const { createNoteController, getUserNotes, updateNote, removeNote, archiveNote, favoriteNote, pinNote, trashNotes, permanentDeleteNote, archiveNoteList, restoreTrash, getSearchNote } = require("../notes/notes.controller");
const requireAuth = require("../middleware/auth.middleware");

const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})


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

router.get("/search-note", requireAuth, getSearchNote);

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            })
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "memoza/notes",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            );
            uploadStream.end(req.file.buffer);
        })

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
            publicId: result.public_id
        })
    } catch (error) {
        console.error("Cloudinary image upload error", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload image"
        })
    }
})


module.exports = router;