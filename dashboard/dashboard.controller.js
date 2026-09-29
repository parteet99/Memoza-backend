const { getArchiveCount, getFolderCount, getNoteCount, getTrashCount, getPinnedNotes, getRecentlyUpdatedNotes } = require("./dashboard.queries")

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

        const note = await getFolderCount(userId);

        return res.status(200).json({
            success: true,
            note
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

const pinnedNotes = async (req, res) => {
    try {
        const userId = req.user.userId;

        const note = await getPinnedNotes(userId);

        return res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        console.error("Failed to get pinned notes", error);

        return res.status(500).json({
            success: false,
            message: "Cannot get pinned notes"
        })
    }
}

const recentlyUpdatedNotes = async (req, res) => {
    try {
        const userId = req.user.userId;

        const note = await getRecentlyUpdatedNotes(userId);

        return res.status(200).json({
            success: true,
            note
        })
    } catch (error) {
        console.error("Failed to get recently updated notes", error);

        return res.status(500).json({
            success: false,
            message: "Cannot get recently updated notes"
        })
    }
}


module.exports = {
    noteCount, archiveCount, folderCount, trashCount, pinnedNotes, recentlyUpdatedNotes
}