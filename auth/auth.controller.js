const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const { getUserByEmail } = require("../users/users.queries");
const { udpateUserPassword, getUserPassword } = require("./auth.queries");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json(400).json({
                error: "Email and password is required."
            })
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }


        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

        //set token in cookie for 7d
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        console.error("Login error", err);

        res.status(500).json({
            success: false,
            error: "Login failed"
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password does not match"
            })
        }

        const user = await getUserPassword(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            })
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await udpateUserPassword(userId, passwordHash);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        console.error("Error updating password", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update password"
        })
    }
}

module.exports = {
    loginUser, logoutUser, changePassword
}
