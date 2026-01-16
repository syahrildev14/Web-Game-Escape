import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  room: { type: String, required: true },

  pretestScore: { type: Number, required: true },
  posttestScore: { type: Number, required: true },

  answers: {
    pre: [Number],
    post: [Number],
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);
