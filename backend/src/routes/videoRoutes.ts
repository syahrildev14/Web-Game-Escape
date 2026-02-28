import express from "express";
import { getVideo, updateVideo } from "../controllers/videoController";

const router = express.Router();

router.get("/:name", getVideo);
router.put("/:name", updateVideo);

export default router;