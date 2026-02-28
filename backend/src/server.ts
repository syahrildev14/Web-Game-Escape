import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import questionRoutes from "./routes/questionRoutes";
import videoRoutes from "./routes/videoRoutes";

const port = process.env.PORT || 5000;

// Register routes
app.use("/api/questions", questionRoutes);
app.use("/api/videos", videoRoutes);

// Start server langsung (tanpa connectDB)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});