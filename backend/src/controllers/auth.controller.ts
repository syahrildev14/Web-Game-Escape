import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { signToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    const user = await AuthService.register(name, email, password);
    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await AuthService.login(email, password);

    const token = signToken({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
