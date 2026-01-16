import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface FinalDialogueProps {
  character: string;
  avatar?: string;
  dialog: string[];
  redirectTo: string;
}

const FinalDialogue: React.FC<FinalDialogueProps> = ({
  character,
  avatar,
  dialog,
  redirectTo,
}) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const isLast = index === dialog.length - 1;

  const nextDialog = () => {
    if (!isLast) {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-900/20">
      <motion.div
        key={index}
        initial={{ y: 200, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-slate-800/80 text-white p-6 rounded-xl
                   w-[80%] max-w-5xl h-72 shadow-2xl backdrop-blur-md
                   border border-white/20"
      >
        <DialogContent
          character={character}
          avatar={avatar}
          text={dialog[index]}
        />

        {/* ACTION */}
        <div className="flex justify-end">
          {!isLast ? (
            <button
              onClick={nextDialog}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-800
                         rounded-md shadow transition -mt-10 active:scale-95"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => navigate(redirectTo)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-800
                         rounded-md shadow transition -mt-10 active:scale-95"
            >
              Lanjut
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FinalDialogue;

/* ==================================================
   TYPEWRITER CONTENT (SAMA SEPERTI SEBELUMNYA)
================================================== */
function DialogContent({
  character,
  avatar,
  text,
}: {
  character: string;
  avatar?: string;
  text: string;
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (displayText.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayText(text.slice(0, displayText.length + 1));
    }, 30);

    return () => clearTimeout(timeout);
  }, [displayText, text]);

  return (
    <div className="flex gap-10 items-center h-full">
      {avatar && (
        <motion.img
          src={avatar}
          alt={character}
          className="w-24 h-24 rounded-full object-cover border border-white/30"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      <div className="flex-1">
        <p className="text-3xl font-bold mb-2">{character}</p>

        <p className="text-2xl leading-relaxed min-h-[3rem]">
          {displayText}
          <span className="animate-pulse">▋</span>
        </p>
      </div>
    </div>
  );
}
