const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const { getUserByEmail } = require("../users/users.queries");

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


module.exports = {
    loginUser, logoutUser
}
