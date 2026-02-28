import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================
// SAVE RESULT
// ============================
export async function saveResult(req: Request, res: Response) {
  try {
    const {
      playerName,
      room,
      pretestScore,
      posttestScore,
    } = req.body;

    const saved = await prisma.result.create({
      data: {
        playerName,
        room,
        pretestScore: Number(pretestScore),
        posttestScore: Number(posttestScore),
      },
    });

    res.status(201).json(saved);

  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

// ============================
// GET RESULTS BY ROOM
// ============================
export async function getResultsByRoom(req: Request, res: Response) {
  try {
    const { room } = req.params;

    const results = await prisma.result.findMany({
      where: { room },
      orderBy: { createdAt: "desc" },
    });

    res.json(results);

  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data" });
  }
}

// ============================
// DELETE RESULT
// ============================
export async function deleteResult(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.result.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Data berhasil dihapus" });

  } catch (err: any) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}