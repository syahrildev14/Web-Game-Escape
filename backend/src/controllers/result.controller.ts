import { Request, Response } from "express";
import Result from "../models/result.model";

export async function saveResult(req: Request, res: Response) {
  try {
    const saved = await Result.create(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getResultsByRoom(req: Request, res: Response) {
  const { room } = req.params;
  const results = await Result.find({ room }).sort({ createdAt: -1 });
  res.json(results);
}

export async function deleteResult(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deleted = await Result.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    return res.json({ message: "Data berhasil dihapus" });
  } catch (err: any) {
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}


