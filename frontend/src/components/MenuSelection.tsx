import React, { useState } from "react";
import { motion } from "framer-motion";
import MultipleChoiceModal from "./MultipleChoiceModal";
import PuzzleModal from "./PuzzleModal";
import ScoreResultModal from "./ScoreResultModal";

import preImg from "../assets/utils/preTest.svg";
import postImg from "../assets/utils/postTest.svg";
import pazzleImg from "../assets/utils/pazzle.svg";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface MenuSelectionProps {
  pretestQuestions: Question[];
  posttestQuestions: Question[];
  puzzleGame: React.ReactNode;
  onFinish?: (data: {
    pre: { score: number; answers: number[] };
    post: { score: number; answers: number[] };
  }) => void;
}

const MenuSelection: React.FC<MenuSelectionProps> = ({
  pretestQuestions,
  posttestQuestions,
  puzzleGame,
  onFinish,
}) => {
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);

  const [pretestResult, setPretestResult] = useState<{
    score: number;
    answers: number[];
  } | null>(null);

  const [posttestResult, setPosttestResult] = useState<{
    score: number;
    answers: number[];
  } | null>(null);

  const [result, setResult] = useState<{
    title: string;
    score: number;
  } | null>(null);

  return (
    <div className="w-screen h-screen flex justify-center items-center relative">
      <div className="flex flex-col items-center gap-12">
        {/* Puzzle */}
        <motion.div
          onClick={() => setShowPuzzle(true)}
          className="cursor-pointer flex flex-col items-center"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
        >
          <div className="w-32 h-32 rounded-full bg-white border-4 border-violet-600 flex justify-center items-center shadow-lg">
            <img src={pazzleImg} className="w-16" />
          </div>
          <p className="text-white text-lg font-semibold mt-2">Puzzle</p>
        </motion.div>

        <div className="flex gap-24">
          {/* Pretest */}
          <motion.div
            onClick={() => setShowPre(true)}
            className="cursor-pointer flex flex-col items-center"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
          >
            <div className="w-32 h-32 rounded-full bg-white border-4 border-violet-600 flex justify-center items-center shadow-lg">
              <img src={preImg} className="w-14" />
            </div>
            <p className="text-white text-lg font-semibold mt-2">Pre-Test</p>
          </motion.div>

          {/* Posttest */}
          <motion.div
            onClick={() => setShowPost(true)}
            className="cursor-pointer flex flex-col items-center"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
          >
            <div className="w-32 h-32 rounded-full bg-white border-4 border-violet-600 flex justify-center items-center shadow-lg">
              <img src={postImg} className="w-14" />
            </div>
            <p className="text-white text-lg font-semibold mt-2">Post-Test</p>
          </motion.div>
        </div>
      </div>

      {/* PRETEST MODAL */}
      {showPre && (
        <MultipleChoiceModal
          title="Pre-test"
          questions={pretestQuestions}
          onSubmit={(data) => {
            setPretestResult(data);
            setResult({ title: "Pre-test Selesai", score: data.score });
          }}
          onClose={() => setShowPre(false)}
        />
      )}

      {/* POSTTEST MODAL */}
      {showPost && (
        <MultipleChoiceModal
          title="Post-test"
          questions={posttestQuestions}
          onSubmit={(data) => {
            setPosttestResult(data);
            setResult({ title: "Post-test Selesai", score: data.score });

            if (pretestResult && onFinish) {
              onFinish({
                pre: pretestResult,
                post: data,
              });
            }
          }}
          onClose={() => setShowPost(false)}
        />
      )}

      {/* PUZZLE MODAL */}
      {showPuzzle && (
        <PuzzleModal onClose={() => setShowPuzzle(false)}>
          {puzzleGame}
        </PuzzleModal>
      )}

      {/* SCORE POPUP */}
      {result && (
        <ScoreResultModal
          title={result.title}
          score={result.score}
          onClose={() => setResult(null)}
        />
      )}

      {/* SCORE SUMMARY */}
      {pretestResult && posttestResult && (
        <div className="absolute bottom-8 left-8 bg-white/90 px-6 py-4 rounded-xl shadow-lg">
          <p className="font-bold text-lg mb-2">📊 Evaluasi</p>
          <p>Pre-Test : <b>{pretestResult.score}</b></p>
          <p>Post-Test: <b>{posttestResult.score}</b></p>
          <p className="mt-1">
            Peningkatan: <b>{posttestResult.score - pretestResult.score}</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuSelection;
