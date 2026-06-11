"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const port = process.env.PORT || 5000;
// Register routes
app_1.default.use("/api/questions", questionRoutes_1.default);
app_1.default.use("/api/videos", videoRoutes_1.default);
// Start server langsung (tanpa connectDB)
app_1.default.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
