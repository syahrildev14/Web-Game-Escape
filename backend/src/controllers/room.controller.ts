import { Request, Response } from "express";
import * as RoomService from "../services/room.service";

export async function getRooms(req: Request, res: Response) {
  const rooms = await RoomService.getRooms();
  res.json({ rooms });
}
