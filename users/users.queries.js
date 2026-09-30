const pool = require("../dbconfig/db.js")
const bcrypt = require("bcrypt");

//register new user
const createUser = async (name, email, password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at, updated_at`

        const values = [name, email, passwordHash];

        const result = await pool.query(query, values);

        return result.rows[0];

    } catch (err) {
        throw err;
    }
}


// get users
const getUsers = async () => {
    const query = `SELECT * FROM users`;
    const result = await pool.query(query);
    return result.rows;
}


// Auth user
const getUserByEmail = async (email) => {
    const query = `SELECT id, name, email, password_hash FROM users WHERE email = $1`
    const values = [email];

    const result = await pool.query(query, values);
    return result.rows[0];
}

const getUserById = async (id) => {
    const query = `SELECT id, name, email, profile_image, created_at FROM users WHERE id = $1`;
    const values = [id];
    const result = await pool.query(query, values);

    return result.rows[0];
}


const updateUserProfileImageQuery = async (id, profileImage, publicId) => {
    const query = `UPDATE users SET profile_image = $1, profile_image_public_id = $2 WHERE id = $3
    RETURNING id, name, email, profile_image, profile_image_public_id, created_at, updated_at`
    const values = [profileImage, publicId, id];
    const result = await pool.query(query, values);

    return result.rows[0];
}

const updateUserData = async (id, email, name) => {
    const query = `UPDATE users SET email = COALESCE($1, email), name = COALESCE($2, name), updated_at = NOW() WHERE id = $3
    RETURNING id, name, email, created_at, updated_at
    `
    const values = [email, name, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}


module.exports = {
    createUser, getUsers, getUserByEmail, getUserById, updateUserProfileImageQuery, updateUserData
}