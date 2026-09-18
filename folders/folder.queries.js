const pool = require("../dbconfig/db");

const createFolder = async (userId, name) => {
    const query = 
        `INSERT INTO folders(user_id, name)
        VALUES ($1, $2)
        RETURNING *;
    `
    const values = [userId, name];
    const result = await pool.query(query, values);
    return result.rows[0];
}


const getFolders = async (userId) => {
    const query = `
        SELECT
            f.id,
            f.name,
            f.user_id,
            f.created_at,
            f.updated_at,
            COUNT(n.id)::INTEGER AS note_count
        FROM folders f
        LEFT JOIN notes n
            ON n.folder_id = f.id
            AND n.user_id = f.user_id
        WHERE f.user_id = $1
        GROUP BY f.id
        ORDER BY f.created_at DESC;
    `

    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

const getFolderById = async (folderId, userId) => {
    const query = `SELECT * FROM folders WHERE id = $1 AND user_id = $2`;
    const values = [folderId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const updateFolder = async (folderId, userId, name) => {
    const query = `UPDATE folders SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *`
    const values = [name, folderId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const deleteFolder = async (folderId, userId) => {
    const query = `DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING *`;
    const values = [folderId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}


const moveNoteToFolder = async (noteId, folderId, userId) => {
    const query = `
        UPDATE notes
        SET folder_id = $1
        WHERE id = $2
        AND user_id = $3
        AND EXISTS (
            SELECT 1
            FROM folders
            WHERE folders.id = $1
            AND folders.user_id = $3
        )
        RETURNING *;
    `;
    const values = [folderId, noteId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const getNotesByFolder = async (folderId, userId) => {
    const query = `SELECT * FROM notes WHERE folder_id = $1 AND user_id = $2 AND is_deleted = false ORDER BY updated_at DESC`
    const values = [folderId, userId];
    const result = await pool.query(query, values);
    return result.rows;
}

module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder,
    moveNoteToFolder,
    getNotesByFolder
}