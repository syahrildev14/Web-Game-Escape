import { Request, Response } from "express";
import * as RoomService from "../services/room.service";

export async function getRooms(req: Request, res: Response) {
  const rooms = await RoomService.getRooms();
  res.json({ rooms });
}

export async function updateRoomCode(req: Request, res: Response) {
  try {
    const room = Array.isArray(req.params.room)
      ? req.params.room[0]
      : req.params.room;
    const { code } = req.body;

    const result = await RoomService.updateRoomCode(room, code);

    if (!result) {
      return res.status(404).json({
        message: "Room tidak ditemukan",
      });
    }

    res.json({ message: "Berhasil update kode" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}