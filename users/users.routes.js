const express = require("express");
const { registerUser, users, getCurrentUser, uploadProfileImage, updateUser} = require("./users.controller");
const requireAuth = require("../middleware/auth.middleware");
const uploadImageMiddleware = require("../middleware/uploadProfileImage")

const router = express.Router();

router.get("/", users)
router.post("/register", registerUser);
router.get("/:id", requireAuth, getCurrentUser);
router.post("/profile-image", requireAuth, uploadImageMiddleware.single("image"),
    uploadProfileImage);
router.put("/update-user", requireAuth, updateUser);

module.exports = router;