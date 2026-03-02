import db from "../config/db";
import bcrypt from "bcrypt";

// ============================
// REGISTER
// ============================
export async function register(
  name: string,
  email: string,
  password: string
) {
  // cek apakah email sudah ada
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  const exist = (rows as any[])[0];

  if (exist) {
    throw new Error("Email sudah digunakan");
  }

  const hash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash]
  );

  return {
    id: (result as any).insertId,
    name,
    email,
  };
}

// ============================
// LOGIN
// ============================
export async function login(email: string, password: string) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  const user = (rows as any[])[0];

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Password salah");
  }

  return user;
}