"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const room_route_1 = __importDefault(require("./routes/room.route"));
const result_route_1 = __importDefault(require("./routes/result.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const stabilizer_route_1 = __importDefault(require("./routes/stabilizer.route"));
const reflection_route_1 = __importDefault(require("./routes/reflection.route"));
const app = (0, express_1.default)();
// ===============================
// CORS CONFIG (Production Ready)
// ===============================
const allowedOrigins = [
    "http://localhost:5173", // dev
    "https://chemescape.com", // production frontend
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true); // allow server-to-server
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// ===============================
// ROUTES
// ===============================
app.use("/api/questions", questionRoutes_1.default);
app.use("/api/videos", videoRoutes_1.default);
app.use("/api/rooms", room_route_1.default);
app.use("/api/results", result_route_1.default);
app.use("/api/auth", auth_route_1.default);
app.use("/api/stabilizer", stabilizer_route_1.default);
app.use("/api/reflections", reflection_route_1.default);
// ===============================
// HEALTH CHECK
// ===============================
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT DATABASE() as db");
        const result = rows;
        res.json({
            status: "OK",
            database: result[0].db,
        });
    }
    catch (error) {
        console.error("DB ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});
// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err.message);
    res.status(500).json({
        message: "Internal Server Error",
    });
});
exports.default = app;
