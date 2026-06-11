"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_controller_1 = require("../controllers/room.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const db_1 = __importDefault(require("../config/db")); // 🔥 WAJIB
const router = (0, express_1.Router)();
// protected route
router.get("/", auth_middleware_1.authGuard, room_controller_1.getRooms);
router.get("/dashboard", auth_middleware_1.authGuard, room_controller_1.getRooms);
// ✅ AMBIL SEMUA KODE DARI DB
router.get("/all", async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT room, code FROM rooms");
        const result = {};
        rows.forEach((r) => {
            result[r.room] = String(r.code);
        });
        console.log("ROOM RESULT:", result);
        res.json(result);
    }
    catch (err) {
        console.error("ERROR GET ROOMS:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// ✅ UPDATE KE DATABASE (BUKAN MEMORY)
router.put("/code/:room", room_controller_1.updateRoomCode);
exports.default = router;
