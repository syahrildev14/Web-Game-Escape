"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideo = exports.getVideo = void 0;
const db_1 = __importDefault(require("../config/db"));
// ============================
// GET video by name
// ============================
const getVideo = async (req, res) => {
    try {
        const [rows] = await db_1.default.query("SELECT * FROM videos WHERE name = ? LIMIT 1", [req.params.name]);
        const video = rows[0];
        if (!video) {
            return res.status(404).json({ message: "Video tidak ditemukan" });
        }
        res.json(video);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil video" });
    }
};
exports.getVideo = getVideo;
// ============================
// UPDATE / CREATE video (UPSERT)
// ============================
const updateVideo = async (req, res) => {
    try {
        const { name } = req.params;
        const { url } = req.body;
        await db_1.default.query(`INSERT INTO videos (name, url)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE url = VALUES(url)`, [name, url]);
        // ambil data terbaru untuk dikembalikan
        const [rows] = await db_1.default.query("SELECT * FROM videos WHERE name = ? LIMIT 1", [name]);
        res.json(rows[0]);
    }
    catch (error) {
        console.error("ERROR UPDATE VIDEO:", error);
        res.status(500).json({ message: "Gagal update video" });
    }
};
exports.updateVideo = updateVideo;
