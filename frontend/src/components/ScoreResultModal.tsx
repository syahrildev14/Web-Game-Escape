import { motion } from "framer-motion";
import { useState } from "react";

interface ReviewItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface ScoreResultModalProps {
  title: string;
  score: number;
  reviewData?: ReviewItem[]; // 🔥 tambahan
  onClose: () => void;
}

const getMessage = (score: number) => {
  if (score >= 80) return "🔥 Luar biasa!";
  if (score >= 60) return "👍 Cukup baik!";
  return "💪 Tetap semangat belajar!";
};

const getColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const ScoreResultModal: React.FC<ScoreResultModalProps> = ({
  title,
  score,
  reviewData = [],
  onClose,
}) => {
  const [showReview, setShowReview] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-2xl p-8 w-[420px] max-h-[90vh] overflow-y-auto text-center shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        <p className={`text-6xl font-extrabold my-4 ${getColor(score)}`}>
          {score}
        </p>

        <p className="text-lg font-semibold mb-4">
          {getMessage(score)}
        </p>

        {/* 🔥 Tombol Pembahasan */}
        {reviewData.length > 0 && (
          <button
            onClick={() => setShowReview(!showReview)}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl mr-4 transition"
          >
            {showReview ? "Tutup Pembahasan" : "Lihat Pembahasan"}
          </button>
        )}

        {/* 🔥 Section Pembahasan */}
        {showReview && (
          <div className="text-left mt-4 space-y-4">
            {reviewData.map((item, index) => {
              const isCorrect = item.userAnswer === item.correctAnswer;

              return (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <p className="font-semibold mb-2">
                    Soal {index + 1}
                  </p>

                  <p className="text-sm mb-2">
                    {item.question}
                  </p>

                  <p className="text-sm">
                    Jawaban Kamu:{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-green-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {item.userAnswer}
                    </span>
                  </p>

                  {!isCorrect && (
                    <>
                      <p className="text-sm">
                        Jawaban Benar:{" "}
                        <span className="text-green-600 font-semibold">
                          {item.correctAnswer}
                        </span>
                      </p>

                      <p className="text-sm mt-2 text-gray-700">
                        📘 {item.explanation}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl transition"
        >
          Lanjutkan
        </button>
      </motion.div>
    </div>
  );
};

export default ScoreResultModal;