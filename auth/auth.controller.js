const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const { getUserByEmail, getUserById } = require("../users/users.queries");
const { udpateUserPassword, getUserPassword, deleteExistingResetToken, deletePasswordResetToken, findUserByEmail, findValidResetToken, updateUserPassword, createPasswordResetToken } = require("./auth.queries");
const { sendPasswordResetEmail } = require("../utils/sendPasswordResetEmail");

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password is required."
            })
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password"
            })
        }


        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

        //set token in cookie for 7d
        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
        res.clearCookie("token", cookieOptions);

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

const getMe = async (req, res) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false });
        }

        return res.status(200).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        })
    } catch (error) {
        return res.status(401).json({success: false, message: error})
    }

}

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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await findUserByEmail(email);
        if (!user) {   //here dont reveal whether email exists or not
            return res.status(200).json({
                message: "If an account exists with this email, a password reset link has been sent"
            })
        }

        //remove previous reset tokens
        await deleteExistingResetToken(user.id);

        //generate random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        //hash token before saving
        const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);  //set 15 minutes

        await createPasswordResetToken(user.id, tokenHash, expiresAt);

        await sendPasswordResetEmail(user.email, resetToken);

        return res.status(200).json({
            success: true,
            message: "If an account exists with this email, a password reset link has been sent"
        })

    } catch (error) {
        console.error("Forgot password error", error);
        return res.status(500).json({
            succes: false,
            message: "Something went wring"
        })
    }
}


const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Token and new password is required"
            })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 8 characters"
            })
        }

        //hash token received from frontend
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const resetToken = await findValidResetToken(tokenHash);
        if (!resetToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            })
        }

        //hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await updateUserPassword(resetToken.user_id, passwordHash);

        await deletePasswordResetToken(resetToken.id);//delete token after password reset

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.error("Reset password error", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

module.exports = {
    loginUser, logoutUser, changePassword, forgotPassword, resetPassword, getMe
}
