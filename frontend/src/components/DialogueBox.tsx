import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DialogBoxProps {
  character: string;
  avatar?: string;
  dialog: string[];
  onFinish?: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  character,
  avatar,
  dialog,
  onFinish,
}) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const fullText = dialog[index];

  const nextDialog = () => {
    if (index < dialog.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setVisible(false);
      onFinish?.();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-900/20">
      <motion.div
        key={index} // 🔑 RESET STATE TANPA useEffect
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
          text={fullText}
          onNext={nextDialog}
        />
      </motion.div>
    </div>
  );
};

export default DialogBox;

/* ==================================================
   SUB COMPONENT — TYPEWRITER (AMAN ESLINT)
================================================== */
function DialogContent({
  character,
  avatar,
  text,
  onNext,
}: {
  character: string;
  avatar?: string;
  text: string;
  onNext: () => void;
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
    <>
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

      <div className="flex justify-end -mt-10">
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800
                     rounded-md shadow transition active:scale-95"
        >
          Next
        </button>
      </div>
    </>
  );
}
