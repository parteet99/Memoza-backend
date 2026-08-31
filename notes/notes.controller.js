const { createNote, findFolderByUser } = require("./notes.queries");

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

module.exports = {
    createNoteController
};