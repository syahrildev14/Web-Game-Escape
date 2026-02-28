import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================
// GET soal berdasarkan room
// ============================
export const getQuestionsByRoom = async (req: Request, res: Response) => {
  const { room } = req.params;

  try {
    const pretest = await prisma.question.findMany({
      where: { room, type: "pretest" },
    });

    const posttest = await prisma.question.findMany({
      where: { room, type: "posttest" },
    });

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

    const newQuestion = await prisma.question.create({
      data: {
        room,
        type,
        question,
        optionA: options[0],
        optionB: options[1],
        optionC: options[2],
        optionD: options[3],
        correctAnswer: Number(correctAnswer),
        explanation: explanation || "",
      },
    });

    res.status(201).json(newQuestion);

  } catch (error) {
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

    const updated = await prisma.question.update({
      where: { id: Number(req.params.id) },
      data: {
        room,
        type,
        question,
        optionA: options[0],
        optionB: options[1],
        optionC: options[2],
        optionD: options[3],
        correctAnswer: Number(correctAnswer),
        explanation: explanation || "",
      },
    });

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: "Gagal update soal" });
  }
};

// ============================
// DELETE soal
// ============================
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    await prisma.question.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Soal dihapus" });

  } catch (err) {
    res.status(500).json({ message: "Gagal hapus soal" });
  }
};