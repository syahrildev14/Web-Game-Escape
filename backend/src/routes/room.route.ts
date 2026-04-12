import { Router } from "express";
import { getRooms, updateRoomCode } from "../controllers/room.controller";
import { authGuard } from "../middlewares/auth.middleware";
import db from "../config/db"; // 🔥 WAJIB

const router = Router();

// protected route
router.get("/", authGuard, getRooms);
router.get("/dashboard", authGuard, getRooms);

// ✅ AMBIL SEMUA KODE DARI DB
router.get("/all", async (req, res) => {
  try {
    const [rows]: any = await db.query(
      "SELECT room, code FROM rooms"
    );

    const result: Record<string, string> = {};

    rows.forEach((r: any) => {
      result[r.room] = String(r.code);
    });

    console.log("ROOM RESULT:", result);

    res.json(result);
  } catch (err) {
    console.error("ERROR GET ROOMS:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE KE DATABASE (BUKAN MEMORY)
router.put("/code/:room", updateRoomCode);

export default router;