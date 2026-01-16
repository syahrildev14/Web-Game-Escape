import { motion } from "framer-motion";

interface ScoreResultModalProps {
  title: string;
  score: number;
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
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-2xl p-8 w-[380px] text-center shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        <p className={`text-6xl font-extrabold my-4 ${getColor(score)}`}>
          {score}
        </p>

        <p className="text-lg font-semibold mb-6">{getMessage(score)}</p>

        <button
          onClick={onClose}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl transition"
        >
          Lanjutkan
        </button>
      </motion.div>
    </div>
  );
};

export default ScoreResultModal;
