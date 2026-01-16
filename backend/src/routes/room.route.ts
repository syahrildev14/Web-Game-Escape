import { Router } from "express";
import { getRooms } from "../controllers/room.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

// protected route
router.get("/", authGuard, getRooms);
router.get("/dashboard", authGuard, getRooms);

export default router;
