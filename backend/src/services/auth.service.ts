import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ============================
// REGISTER
// ============================
export async function register(
  name: string,
  email: string,
  password: string
) {
  // cek apakah email sudah ada
  const exist = await prisma.user.findUnique({
    where: { email },
  });

  if (exist) {
    throw new Error("Email sudah digunakan");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  return user;
}

// ============================
// LOGIN
// ============================
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Password salah");
  }

  return user;
}