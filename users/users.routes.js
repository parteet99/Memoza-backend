const express = require("express");
const { registerUser, users, getCurrentUser, updateUser } = require("./users.controller");
const { updateUserProfileImageQuery } = require("./users.queries");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

router.get("/", users)
router.post("/register", registerUser);
router.get("/:id", requireAuth, getCurrentUser);
router.post("/profile-image", requireAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required"
            })
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "memoza/profile-images",
                    resource_type: "image"
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        })

        const imageUrl = result.secure_url;
        const publicId = result.public_id;

        await updateUserProfileImageQuery(req.user.userId, imageUrl, publicId); //also update to database

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            image: imageUrl,
            publicId: publicId
        })
    } catch (error) {
        console.error("Cloudinary profile upload error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload profile image"
        })
    }
});
router.put("/update-user", requireAuth, updateUser);

module.exports = router;