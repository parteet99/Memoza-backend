const pool = require("../dbconfig/db.js")

const createNote = async (userId, title, content, folderId = null) => {
    const query = `
    INSERT INTO notes (
        user_id, title, content, folder_id
    ) VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, title, content, folder_id, is_archived, is_pinned, is_favorite, is_deleted, created_at, updated_at, deleted_at
    `;

    const values = [userId, title, content, folderId];

    const result = await pool.query(query, values);
    return result.rows[0];

}

const findFolderByUser = async (folderId, userId) => {
    const query = `SELECT id FROM folders WHERE id = $1 AND user_id = $2`;
    const values = [folderId, userId];

    const result = await pool.query(query, values);
    return result.rows[0];
}

const getNotes = async (userId) => {
    const query = `SELECT * FROM notes WHERE user_id = $1 AND is_deleted = false ORDER BY is_pinned DESC, created_at DESC`;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

const editNote = async (id, userId, title, content) => {
    const query = `UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *`
    const values = [title, content, id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const deleteNote = async (userId, id) => {
    const query = `UPDATE notes SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND is_deleted = false RETURNING *`
    const values = [id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const getArchiveNotes = async (userId) => {
    const query = `SELECT * FROM notes WHERE user_id = $1 AND is_deleted = false AND is_archived = true`
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}


const getTrashNotes = async (userId) => {
    const query = `SELECT * FROM notes WHERE user_id = $1 AND is_deleted = true ORDER BY deleted_at DESC` 
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

const restoreNote = async (id, userId) => {
    const query = `UPDATE notes SET is_deleted = false, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND is_deleted = true RETURNING *`
    const values = [id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const deleteTrash = async(id, userId) => {
    const query = `DELETE FROM notes WHERE id = ANY($1) AND user_id = $2 AND is_deleted = true RETURNING *`
    const values = [id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

/* =================NOTES ACTIONS========================== */

const updateArchiveStatus = async (id, userId, isArchived) => {
    const query = `UPDATE notes SET is_archived = $1 WHERE id = $2 AND user_id = $3 RETURNING *`
    const values = [isArchived, id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const updateFavoriteStatus = async (id, userId, isFavorite) => {
    const query = `UPDATE notes SET is_favorite = $1 WHERE id = $2 AND user_id = $3 RETURNING *`
    const values = [isFavorite, id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const updatePinStatus = async (id, userId, isPinned) => {
    const query = `UPDATE notes SET is_pinned = $1 WHERE id = $2 AND user_id = $3 RETURNING *`
    const values = [isPinned, id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    createNote,
    findFolderByUser,
    getNotes,
    editNote,
    deleteNote,
    updateArchiveStatus,
    updateFavoriteStatus,
    updatePinStatus,
    getTrashNotes,
    restoreNote,
    deleteTrash,
    getArchiveNotes
}