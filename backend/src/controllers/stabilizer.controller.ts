import { Request, Response } from "express";
import db from "../config/db";

export const validateCode = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Kode kosong",
            });
        }

        // 🔥 ambil semua room
        const [rows]: any = await db.query(
            "SELECT room, code FROM rooms ORDER BY room ASC"
        );

        // 🔥 mapping biar aman
        const map: Record<string, string> = {};
        rows.forEach((r: any) => {
            map[r.room] = String(r.code);
        });

        // 🔥 susun final code
        const correctCode = [
            map["room1"] || "",
            map["room2"] || "",
            map["room3"] || "",
            map["room4"] || "",
            map["room5"] || "",
            map["room6"] || "",
        ].join("");

        console.log("INPUT USER:", code);
        console.log("KODE DB   :", correctCode);

        if (String(code) === String(correctCode)) {
            return res.json({ success: true });
        }

        return res.json({ success: false });
    } catch (err) {
        console.error("VALIDATE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};