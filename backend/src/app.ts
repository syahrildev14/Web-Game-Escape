import express from "express";
import cors from "cors";
import db from "./config/db";

import questionRoutes from "./routes/questionRoutes";
import videoRoutes from "./routes/videoRoutes";
import roomRoutes from "./routes/room.route";
import resultRoutes from "./routes/result.route";
import authRoutes from "./routes/auth.route";

const app = express();

// ===============================
// CORS CONFIG (Production Ready)
// ===============================
const allowedOrigins = [
    "http://localhost:5173",          // dev
    "https://chemescape.com",         // production frontend
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // allow server-to-server
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.use("/api/questions", questionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/auth", authRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DATABASE() as db");
        const result = rows as any[];

        res.json({
            status: "OK",
            database: result[0].db,
        });
    } catch (error: any) {
        console.error("DB ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err: any, req: any, res: any, next: any) => {
    console.error("GLOBAL ERROR:", err.message);
    res.status(500).json({
        message: "Internal Server Error",
    });
});

export default app;