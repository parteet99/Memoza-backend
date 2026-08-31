const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authorization is required"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        console.error("JWT error", err.message);

        return res.status(401).json({
            error: "Invalid or expired token"
        })
    }
}

module.exports = requireAuth;