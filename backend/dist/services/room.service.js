"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = getRooms;
exports.updateRoomCode = updateRoomCode;
const db_1 = __importDefault(require("../config/db"));
async function getRooms() {
    return [
        { id: 1, name: "Room Alpha" },
        { id: 2, name: "Room Beta" }
    ];
}
async function updateRoomCode(room, code) {
    const [result] = await db_1.default.query("UPDATE rooms SET code = ? WHERE room = ?", [code, room]);
    return result.affectedRows > 0;
}
