"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// ============================
// REGISTER
// ============================
async function register(name, email, password) {
    // cek apakah email sudah ada
    const [rows] = await db_1.default.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    const exist = rows[0];
    if (exist) {
        throw new Error("Email sudah digunakan");
    }
    const hash = await bcrypt_1.default.hash(password, 10);
    const [result] = await db_1.default.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hash]);
    return {
        id: result.insertId,
        name,
        email,
    };
}
// ============================
// LOGIN
// ============================
async function login(email, password) {
    const [rows] = await db_1.default.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    const user = rows[0];
    if (!user) {
        throw new Error("User tidak ditemukan");
    }
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match) {
        throw new Error("Password salah");
    }
    return user;
}
