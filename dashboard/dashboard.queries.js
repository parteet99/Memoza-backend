const pool = require("../dbconfig/db")

const getNoteCount = async (userId) => {
    const query = `SELECT COUNT(*) AS TOTAL FROM notes WHERE user_id = $1 AND is_deleted = false`
    const values = [userId];
    const result = await pool.query(query, values);
    return Number(result.rows[0].total)
}

const getFolderCount = async (userId) => {
    const query = `SELECT COUNT(*) AS TOTAL FROM folders WHERE user_id = $1`
    const values = [userId];
    const result = await pool.query(query, values);
    return Number(result.rows[0].total)
}

const getTrashCount = async (userId) => {
    const query = `SELECT COUNT(*) AS TOTAL FROM notes WHERE user_id = $1 AND is_deleted = true`;
    const values = [userId];
    const result = await pool.query(query, values);
    return Number(result.rows[0].total)
}

const getArchiveCount = async (userId) => {
    const query = `SELECT COUNT(*) AS TOTAL FROM notes WHERE user_id = $1 AND is_deleted = false AND is_archived = true`
    const values = [userId];
    const result = await pool.query(query, values);
    return Number(result.rows[0].total);
}

module.exports = {
    getArchiveCount,
    getFolderCount,
    getNoteCount, 
    getTrashCount
}
