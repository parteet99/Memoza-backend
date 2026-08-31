const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(
    process.cwd(),
    "uploads",
    "profile-images"
);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const userId = req.user.userId;

        const extension =
            path.extname(file.originalname);

        const fileName =
            `${userId}-${Date.now()}${extension}`;

        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};

const uploadImageMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  //5mb
    }
});

module.exports = uploadImageMiddleware;