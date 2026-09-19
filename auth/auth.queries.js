const pool = require("../dbconfig/db");

const getUserPassword = async (userId) => {
    const query = `SELECT password_hash FROM users WHERE id = $1`;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const udpateUserPassword = async(userId, passwordHash) => {
    const query = `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id`;
    const values = [passwordHash, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    udpateUserPassword,
    getUserPassword
}