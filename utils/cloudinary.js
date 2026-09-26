const cloudinary = require("../config/cloudinary");

const deleteImageFromContent = async (content) => {
    if (!content) return;

    const regex = /https:\/\/res\.cloudinary\.com\/[^"']+/g;
    const urls = content.match(regex) || [];

    for (const url of urls) {
        const publicId = url.split("/upload/")[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");

        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Failed to delete", publicId, error);
        }
    }
}

module.exports = {
    deleteImageFromContent
}