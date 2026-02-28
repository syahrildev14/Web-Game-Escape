import express from "express";
import {
  getQuestionsByRoom,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController";

const router = express.Router();

router.get("/:room", getQuestionsByRoom);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;