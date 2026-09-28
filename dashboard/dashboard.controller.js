const { getArchiveCount, getFolderCount, getNoteCount, getTrashCount } = require("./dashboard.queries")

const noteCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const note = await getNoteCount(userId);

        return res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        console.error("Failed to get note count", error);

        return res.status(500).json({
            success: false,
            message: "Cannot get note count"
        })
    }
}

const folderCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const count = await getFolderCount(userId);

        return res.status(200).json({
            success: true,
            count
        })
    } catch (error) {
        console.error("Failed to get folder count", error);

        return res.status(500).json({
            success: false,
            message: "Cannot get folder count"
        })
    }
}

const trashCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const note = await getTrashCount(userId);

        return res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        console.error("Failed to get trash count", error);

        return res.status(500).json({
            success: false,
            message: "Cannot get trash count"
        })
    }
}

const archiveCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const note = await getArchiveCount(userId);

        return res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        console.error("Failed to get archive count", error);

        return res.status(500).json({
            success: false,
            message: "Cannot get archive count"
        })
    }
}

module.exports = {
    noteCount, archiveCount, folderCount, trashCount
}