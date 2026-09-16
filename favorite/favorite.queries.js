const pool = require("../dbconfig/db");

const getFavorites = async (userId) => {
    const query = `SELECT * FROM notes WHERE user_id = $1 AND is_favorite = true AND is_deleted = false`
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
}

module.exports = {
    getFavorites
}

