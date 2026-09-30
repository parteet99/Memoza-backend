const { createUser, getUsers, getUserById, updateUserProfileImageQuery, updateUserData } = require("./users.queries");

const fs = require("fs");
const path = require("path");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            })
        }

        const user = await createUser(name, email, password);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        })
    } catch (err) {
        console.error(err);

        //postgresql unique violation
        if (err.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            })
        }

        return res.json(500).json({
            error: "Failed to create user"
        })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        res.status(200).json({
            user
        })
    } catch (err) {
        console.error("Get current user error", err);

        res.status(500).json({
            error: "Failed to get current user"
        })
    }
}

const users = async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Database error"
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id, email, name } = req.body
        if (!id) {
            return res.status(400).json({
                success: false, 
                message: "User ID is required"
            })
        }

        const user = await updateUserData(id, email || null, name || null);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            data: user
        })

        
    } catch (err) {
        console.error("Update user profile error", err);

        return res.status(500).json({
            success: false,
            message: "Failed to update user profile"
        })
    }
}


module.exports = {registerUser, users, getCurrentUser, updateUser}