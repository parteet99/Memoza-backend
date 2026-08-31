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
    const query = `SELECT * FROM notes WHERE user_id = $1`;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

module.exports = {
    createNote,
    findFolderByUser
}