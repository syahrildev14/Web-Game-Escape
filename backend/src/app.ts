import express from "express";
import cors from "cors";

import questionRoutes from "./routes/questionRoutes";
import videoRoutes from "./routes/videoRoutes";
import roomRoutes from "./routes/room.route";
import resultRoutes from "./routes/result.route";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(cors());
app.use(express.json());

// Register all routes here
app.use("/api/questions", questionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/auth", authRoutes);

export default app;