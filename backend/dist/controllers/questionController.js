"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionsByRoom = void 0;
const db_1 = __importDefault(require("../config/db"));
// ============================
// GET soal berdasarkan room
// ============================
const getQuestionsByRoom = async (req, res) => {
    const { room } = req.params;
    try {
        const [rows] = await db_1.default.query("SELECT * FROM questions WHERE room = ?", [room]);
        const questions = rows;
        const pretest = questions.filter((q) => q.type === "pretest");
        const posttest = questions.filter((q) => q.type === "posttest");
        const format = (data) => data.map((q) => ({
            id: q.id,
            room: q.room,
            type: q.type,
            question: q.question,
            options: [q.optionA, q.optionB, q.optionC, q.optionD],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
        }));
        res.json({
            pretest: format(pretest),
            posttest: format(posttest),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil soal" });
    }
};
exports.getQuestionsByRoom = getQuestionsByRoom;
// ============================
// CREATE soal
// ============================
const createQuestion = async (req, res) => {
    try {
        const { room, type, question, options, correctAnswer, explanation, } = req.body;
        const [result] = await db_1.default.query(`INSERT INTO questions 
      (room, type, question, optionA, optionB, optionC, optionD, correctAnswer, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            room,
            type,
            question,
            options[0],
            options[1],
            options[2],
            options[3],
            Number(correctAnswer),
            explanation || "",
        ]);
        res.status(201).json({
            id: result.insertId,
            room,
            type,
            question,
            options,
            correctAnswer: Number(correctAnswer),
            explanation: explanation || "",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal menambahkan soal" });
    }
};
exports.createQuestion = createQuestion;
// ============================
// UPDATE soal
// ============================
const updateQuestion = async (req, res) => {
    try {
        const { room, type, question, options, correctAnswer, explanation, } = req.body;
        await db_1.default.query(`UPDATE questions SET 
        room=?, 
        type=?, 
        question=?, 
        optionA=?, 
        optionB=?, 
        optionC=?, 
        optionD=?, 
        correctAnswer=?, 
        explanation=? 
      WHERE id=?`, [
            room,
            type,
            question,
            options[0],
            options[1],
            options[2],
            options[3],
            Number(correctAnswer),
            explanation || "",
            Number(req.params.id),
        ]);
        res.json({ message: "Soal berhasil diupdate" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal update soal" });
    }
};
exports.updateQuestion = updateQuestion;
// ============================
// DELETE soal
// ============================
const deleteQuestion = async (req, res) => {
    try {
        await db_1.default.query("DELETE FROM questions WHERE id = ?", [Number(req.params.id)]);
        res.json({ message: "Soal dihapus" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal hapus soal" });
    }
};
exports.deleteQuestion = deleteQuestion;
