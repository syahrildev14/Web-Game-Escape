"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
/**
 * POST REFLECTION
 */
router.post("/", async (req, res) => {
    try {
        const { player_name, learned, challenge_text, strategy, rating, } = req.body;
        // Validasi
        if (!player_name ||
            !learned ||
            !challenge_text ||
            !strategy ||
            !rating) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib diisi",
            });
        }
        const numericRating = Number(rating);
        if (Number.isNaN(numericRating) ||
            numericRating < 1 ||
            numericRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating harus antara 1 sampai 5",
            });
        }
        await db_1.default.query(`
            INSERT INTO reflections
            (
                player_name,
                learned,
                challenge_text,
                strategy,
                rating
            )
            VALUES (?, ?, ?, ?, ?)
            `, [
            player_name,
            learned,
            challenge_text,
            strategy,
            numericRating,
        ]);
        return res.status(201).json({
            success: true,
            message: "Refleksi berhasil disimpan",
        });
    }
    catch (error) {
        console.error("POST REFLECTION ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal menyimpan refleksi",
        });
    }
});
/**
 * GET ALL REFLECTIONS
 */
router.get("/", async (req, res) => {
    try {
        const [rows] = await db_1.default.query(`
            SELECT
                id,
                player_name,
                learned,
                challenge_text,
                strategy,
                rating,
                created_at
            FROM reflections
            ORDER BY created_at DESC
            `);
        return res.status(200).json({
            success: true,
            data: rows,
        });
    }
    catch (error) {
        console.error("GET REFLECTIONS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data refleksi",
        });
    }
});
exports.default = router;
