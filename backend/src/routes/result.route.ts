import { Router } from "express";
import { saveResult, getResultsByRoom, deleteResult } from "../controllers/result.controller";
import { getGlobalRanking } from "../controllers/globalRangking.controller";

const router = Router();

router.post("/", saveResult);
router.get("/room/:room", getResultsByRoom);
router.delete("/:id", deleteResult);
router.get("/ranking/global", getGlobalRanking);


export default router;
