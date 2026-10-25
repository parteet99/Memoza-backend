require("dotenv").config();

const express = require("express");
const pool = require("./dbconfig/db");
const userRoutes = require("./users/users.routes");
const authRoutes = require("./auth/auth.routes");
const noteRoutes = require("./notes/notes.routes");
const folderRoutes = require("./folders/folder.routes");
const favoriteRoutes = require("./favorite/favorite.routes");
const countRoutes = require("./dashboard/dashboard.routes");
const aiRoutes = require("./AI/ai.routes")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { connectRedis } = require("./config/redis");

const app = express();
app.set("trust proxy", 1);
app.use(cors({
    // origin: "http://localhost:3000",
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

// body parser
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", countRoutes);

app.get("/health", (req, res) => {
    res.status(200).send("ok");
})

async function startServer() {
    try {
        await pool.query("SELECT NOW()");
        console.log("Database connected");

        await connectRedis();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Server startup failed", error);
        process.exit(1);
    }
}

startServer();