const { createNote, findFolderByUser, getNotes, editNote, deleteNote, updateArchiveStatus, updateFavoriteStatus, updatePinStatus, getTrashNotes, restoreNote, deleteTrash, getArchiveNotes, searchNotes } = require("./notes.queries");

const createNoteController = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { title, content, folder_id } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }

        //validate folder ownership
        if (folder_id !== undefined && folder_id !== null) {
            const folder = await findFolderByUser(folder_id, userId)
            if (!folder) {
                return res.json(400).json({
                    success: false,
                    message: "Folder not found"
                })
            }
        };


        const note = await createNote(userId, title.trim(), content || null, folder_id || null);

        return res.status(201).json({
            success: true,
            message: "Note created successfully.",
            note
        })
        
    } catch (err) {
        console.error("Failed to create note", err);

        return res.status(500).json({
            success: false,
            message: "Failed to create new note"
        })
    }
}

const getUserNotes = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notes = await getNotes(userId);
        if (!notes) {
            return res.status(400).json({
                success: false,
                message: "Failed to fetch notes"
            })
        }

        return res.status(201).json({
            success: true,
            message: "Fetched users notes successfully.",
            notes
        })
    } catch (err) {
        console.error("Failed to fetch notes", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user notes"
        })
    }
}

const updateNote = async(req, res) => {
    try {
        const userId = req.user.userId;
        const { id, title, content } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }

        const note = await editNote(id, userId, title, content);
        
        return res.status(201).json({
            success: true,
            message: "Note updated successfully",
            note
        })
    } catch (err) {
        console.error("Unable to update note", err);

        return res.status(500).json({
            success: false,
            message: "Failed to update the note"
        })
    }
}

const removeNote = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required to delete note"
            });
        }
        const note = await deleteNote(userId, id);
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully.",
            note
        })
    } catch (err) {
        console.error()
    }
}

const archiveNote = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, is_archived } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required to archive note"
            })
        }

        const note = await updateArchiveStatus(id, userId, is_archived);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        return res.status(201).json({
            success: true,
            message: "Note archived successfully",
            note
        })
    } catch (err) {
        console.error("Error archiving note", err);

        return res.status(500).json({
            success: false,
            message: "Cannot archive note"
        })
    }
}

const favoriteNote = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, is_favorite } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required"
            })
        }

        const note = await updateFavoriteStatus(id, userId, is_favorite);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Note added to favorite",
            note
        })
    } catch (err) {
        console.error("Error starring note", err);

        return res.status(500).json({
            success: false,
            message: "Cannot favorite note"
        })
    }
}

const pinNote = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, is_pinned } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required to pin note"
            })
        }

        const note = await updatePinStatus(id, userId, is_pinned);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: is_pinned
                ? "Note pinned successfully"
                : "Note unpinned successfully",
            note
        })
    } catch (error) {
        console.error("Error pinning note", error);

        return res.status(500).json({
            success: false,
            message: "Failed to pin note"
        })
    }
}

const archiveNoteList = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notes = await getArchiveNotes(userId);
        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "No archive notes found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Archive notes fetched successfully",
            notes
        })
    } catch (error) {
        console.error("Error fetching archived notes", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch archived notes"
        })
    }
}


const trashNotes = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notes = await getTrashNotes(userId);
        if (!notes) {
            return res.status(404).json({
                success: false,
                message: "Trash notes not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Trash fetched successfully",
            notes
        })
    } catch (error) {
        console.error("Error getting trash notes", error);
        return res.status(500).json({
            success: false,
            message: "Unable to get trashed notes"
        })
    }
}

const restoreTrash = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Note ID(s) is required to restore"
            })
        }

        const notes = await restoreNote(ids, userId)
        if (notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Note restored successfully",
            notes
        })
    } catch (error) {
        console.error("Error restoring note", error);
        return res.status(500).json({
            success: false,
            message: "Unable to restore note"
        })
    }
}

const permanentDeleteNote = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Note ID(s) is required to delete note"
            })
        }

        const notes = await deleteTrash(ids, userId)
        if (notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No trashed notes found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            notes
        })
    } catch (error) {
        console.error("Error deleting note", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete note"
        })
    }
}

const getSearchNote = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { query } = req.query;
        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            })
        }

        const notes = await searchNotes(query.trim(), userId);

        return res.status(200).json({
            success: true,
            notes
        })
    } catch (error) {
        console.error("Error searching notes", error);
        return res.status(500).json({
            success: false,
            message: "Unable to search notes"
        })
    }
}

module.exports = {
    createNoteController, getUserNotes, updateNote, removeNote, archiveNote, favoriteNote, pinNote, trashNotes, restoreTrash, permanentDeleteNote, archiveNoteList, getSearchNote
};