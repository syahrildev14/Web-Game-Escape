import bcrypt from "bcrypt";
import { User } from "../models/user.model";

export async function register(name: string, email: string, password: string) {
  const exist = await User.findOne({ email });
  if (exist) throw new Error("Email sudah digunakan");

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User tidak ditemukan");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Password salah");

  return user;
}
