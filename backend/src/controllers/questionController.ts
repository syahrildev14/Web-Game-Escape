import { Request, Response } from "express";
import db from "../config/db";

// ============================
// GET soal berdasarkan room
// ============================
export const getQuestionsByRoom = async (req: Request, res: Response) => {
  const { room } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM questions WHERE room = ?",
      [room]
    );

    const questions = rows as any[];

    const pretest = questions.filter((q) => q.type === "pretest");
    const posttest = questions.filter((q) => q.type === "posttest");

    const format = (data: any[]) =>
      data.map((q) => ({
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

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil soal" });
  }
};

// ============================
// CREATE soal
// ============================
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const {
      room,
      type,
      question,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO questions 
      (room, type, question, optionA, optionB, optionC, optionD, correctAnswer, explanation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        room,
        type,
        question,
        options[0],
        options[1],
        options[2],
        options[3],
        Number(correctAnswer),
        explanation || "",
      ]
    );

    res.status(201).json({
      id: (result as any).insertId,
      room,
      type,
      question,
      options,
      correctAnswer: Number(correctAnswer),
      explanation: explanation || "",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan soal" });
  }
};

// ============================
// UPDATE soal
// ============================
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const {
      room,
      type,
      question,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    await db.query(
      `UPDATE questions SET 
        room=?, 
        type=?, 
        question=?, 
        optionA=?, 
        optionB=?, 
        optionC=?, 
        optionD=?, 
        correctAnswer=?, 
        explanation=? 
      WHERE id=?`,
      [
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
      ]
    );

    res.json({ message: "Soal berhasil diupdate" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update soal" });
  }
};

// ============================
// DELETE soal
// ============================
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    await db.query(
      "DELETE FROM questions WHERE id = ?",
      [Number(req.params.id)]
    );

    res.json({ message: "Soal dihapus" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal hapus soal" });
  }
};