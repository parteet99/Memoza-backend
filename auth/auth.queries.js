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

const findUserByEmail = async (email) => {
    const query = `SELECT id, email FROM users WHERE email = $1`
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const createPasswordResetToken = async (userId, tokenHash, expiresAt) => {
    const query = `INSERT INTO password_reset_token (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id, user_id, expires_at`
    const values = [userId, tokenHash, expiresAt]
    const result = await pool.query(query, values);
    return result.rows[0];
}

const findValidResetToken = async (tokenHash) => {
    const query = `SELECT id, user_id, expires_at FROM password_reset_token WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP`
    const values = [tokenHash]
    const result = await pool.query(query, values);
    return result.rows[0];
}

const updateUserPassword = async (userId, passwordHash) => {
    const query = `UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id`
    const values = [passwordHash, userId]
    const result = await pool.query(query, values);
    return result.rows[0];
}

const deletePasswordResetToken = async (tokenId) => {
    await pool.query(`DELETE FROM password_reset_token WHERE id = $1`, [tokenId]);
}

const deleteExistingResetToken = async (userId) => {
    await pool.query(`DELETE FROM password_reset_token WHERE user_id = $1`, [userId])
}


module.exports = {
    udpateUserPassword,
    getUserPassword,
    findUserByEmail,
    findValidResetToken,
    deleteExistingResetToken,
    deletePasswordResetToken,
    updateUserPassword,
    createPasswordResetToken
}