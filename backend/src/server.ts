import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./database";

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
