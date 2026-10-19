const rateLimit = require("express-rate-limit");

const userOrIpKey = (req) => {
    if (req.user?.userId) return `user:${req.user.userId}`;
    return `ip:${req.ip}`
};

const emailKey = (req) => {
    const email = req.body?.email;
    if (typeof email === "string" && email.trim()) {
        return `email:${email.trim().toLowerCase()}`;
    }

    return `ip:${req.ip}`
}

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4,
    keyGenerator: emailKey,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
})

const forgotPasswordLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    keyGenerator: emailKey,
    message: {
        success: false,
        message: "Too many password reset requests. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
})

const resetPasswordLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        if (req.user?.userId) return `user:${req.user.userId}`;
        const token = req.params?.token || req.body?.token;
        if (token) return `token:${token}`;
        return `ip:${req.ip}`;
    },
    message: {
        success: false,
        message: "Too many reset attempts. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
})

const aiLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 8,
    keyGenerator: userOrIpKey,
    message: {
        success: false,
        message: "AI request limit reached. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
})

const uploadLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: userOrIpKey,
    message: {
        success: false,
        message: "Too many uploads. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
})


module.exports = {
    loginLimit,
    forgotPasswordLimit,
    resetPasswordLimit,
    aiLimit,
    uploadLimit
}