import { Request, Response } from "express";
import db from "../config/db";

export async function getGlobalRanking(req: Request, res: Response) {
  try {
    // 1️⃣ Ambil semua result dari MySQL
    const [rows] = await db.query("SELECT playerName, pretestScore, posttestScore FROM results");

    const results = rows as any[];

    // 2️⃣ Hitung rata-rata tiap record
    const withAvg = results.map((r) => ({
      playerName: r.playerName,
      avgScore: (r.pretestScore + r.posttestScore) / 2,
    }));

    // 3️⃣ Group berdasarkan playerName
    const grouped: Record<string, number[]> = {};

    withAvg.forEach((r) => {
      if (!grouped[r.playerName]) {
        grouped[r.playerName] = [];
      }
      grouped[r.playerName].push(r.avgScore);
    });

    // 4️⃣ Hitung rata-rata total per player
    const ranking = Object.entries(grouped).map(([playerName, scores]) => {
      const totalAvg =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      return { playerName, totalAvg };
    });

    // 5️⃣ Sort descending
    ranking.sort((a, b) => b.totalAvg - a.totalAvg);

    return res.json(ranking);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gagal memuat ranking" });
  }
}