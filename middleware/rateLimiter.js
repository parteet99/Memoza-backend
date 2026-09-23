const rateLimit = require("express-rate-limit");

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 4,
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