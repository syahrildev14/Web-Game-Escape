import { Request, Response } from "express";
import db from "../config/db";

// type untuk params
interface VideoParams {
  name: string;
}

// ============================
// GET video by name
// ============================
export const getVideo = async (
  req: Request<VideoParams>,
  res: Response
) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM videos WHERE name = ? LIMIT 1",
      [req.params.name]
    );

    const video = (rows as any[])[0];

    if (!video) {
      return res.status(404).json({ message: "Video tidak ditemukan" });
    }

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil video" });
  }
};

// ============================
// UPDATE / CREATE video (UPSERT)
// ============================
export const updateVideo = async (
  req: Request<VideoParams>,
  res: Response
) => {
  try {
    const { name } = req.params;
    const { url } = req.body;

    await db.query(
      `INSERT INTO videos (name, url)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE url = VALUES(url)`,
      [name, url]
    );

    // ambil data terbaru untuk dikembalikan
    const [rows] = await db.query(
      "SELECT * FROM videos WHERE name = ? LIMIT 1",
      [name]
    );

    res.json((rows as any[])[0]);

  } catch (error) {
    console.error("ERROR UPDATE VIDEO:", error);
    res.status(500).json({ message: "Gagal update video" });
  }
};