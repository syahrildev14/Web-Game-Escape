"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCode = void 0;
const db_1 = __importDefault(require("../config/db"));
const validateCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Kode kosong",
            });
        }
        // 🔥 ambil semua room
        const [rows] = await db_1.default.query("SELECT room, code FROM rooms ORDER BY room ASC");
        // 🔥 mapping biar aman
        const map = {};
        rows.forEach((r) => {
            map[r.room] = String(r.code);
        });
        // 🔥 susun final code
        const correctCode = [
            map["room1"] || "",
            map["room2"] || "",
            map["room3"] || "",
            map["room4"] || "",
            map["room5"] || "",
            map["room6"] || "",
        ].join("");
        console.log("INPUT USER:", code);
        console.log("KODE DB   :", correctCode);
        if (String(code) === String(correctCode)) {
            return res.json({ success: true });
        }
        return res.json({ success: false });
    }
    catch (err) {
        console.error("VALIDATE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.validateCode = validateCode;
