import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import roomRoutes from "./routes/room.route";
import resultRoutes from "./routes/result.route";

const app = express();

app.use(cors());
app.use(express.json());

// register routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/results", resultRoutes);

export default app;
