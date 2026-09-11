const { createFolder, getFolders, getFolderById, updateFolder, deleteFolder, moveNoteToFolder, getNotesByFolder } = require("./folder.queries")

const createNewFolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Folder name is required"
            })
        }

        const folderName = name.trim();

        if (folderName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Folder name cannot exceed 100 characters"
            })
        }

        const folder = await createFolder(userId, folderName);

        return res.status(201).json({
            success: true,
            message: "Folder created successfully",
            folder
        })

        
    } catch (err) {
        console.error("Create folder error", err);

        //postgresql unique violation
        if (err.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A folder with this name already exists"
            })
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create folder"
        })
    }
}

const getFolder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const folders = await getFolders(userId);

        return res.status(200).json({
            success: true, 
            message: "Folders fetched successfully",
            folders
        })
    } catch (err) {
        console.error("Error getting folders", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch folders."
        })
    }
}

const getfolderById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Folder ID is required"
            })
        }
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required to get folder"
            })
        }
        const folder = await getFolderById(id, userId);

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Folder fetched successfully",
            folder
        })
    } catch (err) {
        console.err("Error fetching folder", err);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch folder"
        })
    }
}

const updateFolderName = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, name } = req.query;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Folder name is required"
            });
        }

        const folderName = name.trim();

        if (folderName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Folder name cannot exceed 100 characters"
            })
        }

        const folder = await updateFolder(id, userId, name);

        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Folder updated successfully",
            folder
        })
    } catch (err) {
        console.error("Error updating folder", err);

        if (err.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A folder with this name already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update folder"
        })
    }
}

const deletefolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Folder ID is required to delete."
            })
        }
        const folder = await deleteFolder(id, userId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder does not exist"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Folder deleted successfully",
        })
    } catch (err) {
        console.error("Error deleting folder", err);

        return res.status(500).json({
            success: false,

        })
    }
}

const noteToFolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, folder_id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required"
            })
        }

        if (!folder_id) {
            return res.status(400).json({
                success: false,
                message: "Folder ID is required"
            })
        }

        const folder = await moveNoteToFolder(id, folder_id, userId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Note or Folder not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Note moved into folder successfully",
            folder
        })
    } catch (err) {
        console.error("Error moving note to folder", err);

        return res.status(500).json({
            success: false,
            message: "Cannot move note to folder"
        })
    }
}

const notesByFolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Folder ID is required to fetch notes"
            })
        }

        const folder = await getNotesByFolder(id, userId);
        if (!folder) {
            return res.status(404).json({
                success: false,
                message: "Folder or Notes not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            folder
        })
    } catch (err) {
        console.error("Error getting notes from folder", err);

        return res.status(500).json({
            success: false,
            message: "Cannot get folder notes"
        })
    }
}

module.exports = {
    createNewFolder,
    getFolder,
    getfolderById,
    updateFolderName,
    deletefolder,
    noteToFolder,
    notesByFolder
}