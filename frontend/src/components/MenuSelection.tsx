import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MultipleChoiceModal from "./MultipleChoiceModal";
import PuzzleModal from "./PuzzleModal";
import ScoreResultModal from "./ScoreResultModal";
import { useGameStore } from "../store/useGameStore";

import preImg from "../assets/utils/preTest.svg";
import postImg from "../assets/utils/postTest.svg";
import pazzleImg from "../assets/utils/pazzle.svg";
import { useLocation } from "react-router-dom";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  reviewData?: any[];
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
  const [showCode, setShowCode] = useState(false);

  const [reviewData, setReviewData] = useState<any[]>([]);
  const [isPuzzleDone, setIsPuzzleDone] = useState(false);

  const [pretestResult, setPretestResult] = useState<any>(null);
  const [posttestResult, setPosttestResult] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const { codes, fetchCodes } = useGameStore();

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const isPretestDone = !!pretestResult;
  const isPosttestDone = !!posttestResult;

  // 🔥 ROOM AKTIF (sementara hardcode, bisa dari router nanti)
  const location = useLocation();

  let currentRoom = "room1";

  if (location.pathname.includes("/ion")) currentRoom = "room1";
  else if (location.pathname.includes("/kovalen")) currentRoom = "room2";
  else if (location.pathname.includes("/elektro")) currentRoom = "room3";
  else if (location.pathname.includes("/lewis")) currentRoom = "room4";
  else if (location.pathname.includes("/logam")) currentRoom = "room5";
  else if (location.pathname.includes("/gaya")) currentRoom = "room6";

  // 🔥 KODE PER ROOM (FIX)
  const currentCode = codes[currentRoom];

  return (
    <div className="w-screen h-screen flex justify-center items-center relative">
      <div className="flex flex-col items-center gap-12">

        {/* PUZZLE */}
        <motion.div
          onClick={() => {
            if (!isPosttestDone) return;
            setShowPuzzle(true);
          }}
          className={`flex flex-col items-center ${isPosttestDone
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50"
            }`}
          whileHover={isPosttestDone ? { scale: 1.15 } : {}}
          whileTap={isPosttestDone ? { scale: 0.95 } : {}}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-32 h-32 rounded-full bg-white border-4 border-violet-600 flex justify-center items-center shadow-lg">
            <img src={pazzleImg} className="w-16" />
          </div>
          <p className="text-white text-lg font-semibold mt-2">
            Puzzle {!isPosttestDone && "🔒"}
          </p>
        </motion.div>

        {/* BUKA KODE */}
        <motion.div
          onClick={() => {
            if (!isPuzzleDone) return;
            setShowCode(true);
          }}
          className={`flex flex-col items-center ${isPuzzleDone
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50"
            }`}
          whileHover={isPuzzleDone ? { scale: 1.15 } : {}}
          whileTap={isPuzzleDone ? { scale: 0.95 } : {}}
        >
          <div className="w-32 h-32 rounded-full bg-white border-4 border-green-600 flex justify-center items-center shadow-lg text-3xl">
            🔐
          </div>
          <p className="text-white text-lg font-semibold mt-2">
            Buka Kode {!isPuzzleDone && "🔒"}
          </p>
        </motion.div>

        <div className="flex gap-24">

          {/* PRETEST */}
          <motion.div
            onClick={() => setShowPre(true)}
            className="cursor-pointer flex flex-col items-center"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          >
            <div className="w-32 h-32 rounded-full bg-white border-4 border-violet-600 flex justify-center items-center shadow-lg">
              <img src={preImg} className="w-14" />
            </div>
            <p className="text-white text-lg font-semibold mt-2">
              Pre-Test
            </p>
          </motion.div>

          {/* POSTTEST */}
          <motion.div
            onClick={() => {
              if (!isPretestDone) return;
              setShowPost(true);
            }}
            className={`flex flex-col items-center ${isPretestDone
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-50"
              }`}
            whileHover={isPretestDone ? { scale: 1.12 } : {}}
            whileTap={isPretestDone ? { scale: 0.95 } : {}}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          >
            <div className="w-32 h-32 rounded-full bg-white border-4 border-violet-600 flex justify-center items-center shadow-lg">
              <img src={postImg} className="w-14" />
            </div>
            <p className="text-white text-lg font-semibold mt-2">
              Post-Test {!isPretestDone && "🔒"}
            </p>
          </motion.div>

        </div>
      </div>

      {/* PRETEST */}
      {showPre && (
        <MultipleChoiceModal
          title="Pre-test"
          questions={pretestQuestions}
          onSubmit={(data) => {
            setPretestResult(data);
            setReviewData(data.reviewData || []);
            setResult({ title: "Pre-test Selesai", score: data.score });

            setShowPre(false);
            setTimeout(() => setShowPost(true), 800);
          }}
          onClose={() => setShowPre(false)}
        />
      )}

      {/* POSTTEST */}
      {showPost && (
        <MultipleChoiceModal
          title="Post-test"
          questions={posttestQuestions}
          onSubmit={(data) => {
            setPosttestResult(data);
            setResult({ title: "Post-test Selesai", score: data.score });

            if (pretestResult && onFinish) {
              onFinish({ pre: pretestResult, post: data });
            }
          }}
          onClose={() => setShowPost(false)}
        />
      )}

      {/* PUZZLE */}
      {showPuzzle && (
        <PuzzleModal onClose={() => setShowPuzzle(false)}>
          <div className="relative w-full h-full">

            {puzzleGame}

            <button
              onClick={() => {
                setIsPuzzleDone(true);
                setShowPuzzle(false);
                setShowCode(true);
              }}
              className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              Selesai ✅
            </button>

          </div>
        </PuzzleModal>
      )}

      {/* MODAL KODE */}
      {showCode && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl text-center space-y-4">
            <h2 className="text-xl font-bold">🎉 Kode Terbuka!</h2>

            <p className="text-2xl font-mono tracking-widest">
              {currentCode || "......"}
            </p>

            {!currentCode && (
              <p className="text-sm text-gray-500">
                Mengambil kode dari server...
              </p>
            )}

            <button
              onClick={() => setShowCode(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* SCORE */}
      {result && (
        <ScoreResultModal
          title={result.title}
          score={result.score}
          reviewData={reviewData}
          onClose={() => setResult(null)}
        />
      )}

      {/* SUMMARY */}
      {pretestResult && posttestResult && (
        <div className="absolute top-20 left-8 bg-white/90 px-6 py-4 rounded-xl shadow-lg">
          <p className="font-bold text-lg mb-2">📊 Evaluasi</p>
          <p>Pre-Test : <b>{pretestResult.score}</b></p>
          <p>Post-Test: <b>{posttestResult.score}</b></p>
          <p className="mt-1">
            Peningkatan:{" "}
            <b>{posttestResult.score - pretestResult.score}</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuSelection;