const { createNote, findFolderByUser, getNotes, editNote, deleteNote } = require("./notes.queries");

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

module.exports = {
    createNoteController, getUserNotes, updateNote, removeNote
};