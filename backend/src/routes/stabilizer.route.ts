import { Router } from "express";
import { validateCode } from "../controllers/stabilizer.controller";

const router = Router();

router.post("/validate-code", validateCode);

export default router;