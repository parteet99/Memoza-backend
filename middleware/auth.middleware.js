const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { redis } = require("../config/redis");

const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authorization is required"
            })
        }

        //verify jwt signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //generate the same hash used during logout
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const isBlackListed = await redis.exists(`blacklist:${tokenHash}`);
        if (isBlackListed) {
            return res.status(401).json({
                success: false,
                message: "Token has been revoked. Please login again"
            })
        }

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