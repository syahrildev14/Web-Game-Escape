import { Request, Response } from "express";
import db from "../config/db";

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

    const [result] = await db.query(
      `INSERT INTO results 
      (playerName, room, pretestScore, posttestScore) 
      VALUES (?, ?, ?, ?)`,
      [
        playerName,
        room,
        Number(pretestScore),
        Number(posttestScore),
      ]
    );

    res.status(201).json({
      id: (result as any).insertId,
      playerName,
      room,
      pretestScore: Number(pretestScore),
      posttestScore: Number(posttestScore),
    });

  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// ============================
// GET RESULTS BY ROOM
// ============================
export async function getResultsByRoom(req: Request, res: Response) {
  try {
    const { room } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM results 
       WHERE room = ? 
       ORDER BY createdAt DESC`,
      [room]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
}

// ============================
// DELETE RESULT
// ============================
export async function deleteResult(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM results WHERE id = ?",
      [Number(id)]
    );

    return res.json({ message: "Data berhasil dihapus" });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}

export async function deleteResult(req: Request, res: Response) {
  try {
    const { id } = req.params;
    console.log("DELETE ID:", id);

    await db.query(
      "DELETE FROM results WHERE id = ?",
      [Number(id)]
    );

    return res.json({ message: "Data berhasil dihapus" });

  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}