"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveResult = saveResult;
exports.getResultsByRoom = getResultsByRoom;
exports.deleteResult = deleteResult;
const db_1 = __importDefault(require("../config/db"));
// ============================
// SAVE RESULT
// ============================
async function saveResult(req, res) {
    try {
        const { playerName, room, pretestScore, posttestScore, } = req.body;
        const [result] = await db_1.default.query(`INSERT INTO results 
      (playerName, room, pretestScore, posttestScore) 
      VALUES (?, ?, ?, ?)`, [
            playerName,
            room,
            Number(pretestScore),
            Number(posttestScore),
        ]);
        res.status(201).json({
            id: result.insertId,
            playerName,
            room,
            pretestScore: Number(pretestScore),
            posttestScore: Number(posttestScore),
        });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
}
// ============================
// GET RESULTS BY ROOM
// ============================
async function getResultsByRoom(req, res) {
    try {
        const { room } = req.params;
        const [rows] = await db_1.default.query(`SELECT * FROM results 
       WHERE room = ? 
       ORDER BY createdAt DESC`, [room]);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data" });
    }
}
// ============================
// DELETE RESULT
// ============================
async function deleteResult(req, res) {
    try {
        const { id } = req.params;
        await db_1.default.query("DELETE FROM results WHERE id = ?", [Number(id)]);
        return res.json({ message: "Data berhasil dihapus" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}
