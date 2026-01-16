import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token missing" });

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) return res.status(403).json({ message: "Token invalid" });

    (req as any).user = decoded;
    next();
  });
}
