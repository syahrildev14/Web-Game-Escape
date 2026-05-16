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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-900/20 px-4">
      <motion.div
        key={index}
        initial={{ y: 200, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          bg-slate-800/80
          text-white
          backdrop-blur-md
          border border-white/20
          shadow-2xl
          rounded-2xl

          w-full
          max-w-5xl

          min-h-[260px]
          sm:min-h-[300px]

          p-4
          sm:p-6
          md:p-8

          flex
          flex-col
        "
      >
        {/* CONTENT */}
        <div className="flex-1">
          <DialogContent
            character={character}
            avatar={avatar}
            text={dialog[index]}
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-center md:justify-end mt-6">
          {!isLast ? (
            <button
              onClick={nextDialog}
              className="
                px-5
                py-2.5
                bg-blue-600
                hover:bg-blue-800
                rounded-lg
                shadow-lg
                transition
                active:scale-95
                text-sm
                sm:text-base
                font-semibold
              "
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => navigate(redirectTo)}
              className="
                px-6
                py-2.5
                bg-green-600
                hover:bg-green-700
                rounded-lg
                shadow-lg
                transition
                active:scale-95
                text-sm
                sm:text-base
                font-semibold
              "
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
   TYPEWRITER CONTENT
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
    setDisplayText("");
  }, [text]);

  useEffect(() => {
    if (displayText.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayText(text.slice(0, displayText.length + 1));
    }, 30);

    return () => clearTimeout(timeout);
  }, [displayText, text]);

  return (
    <div
      className="
        flex
        flex-col
        md:flex-row
        items-center
        md:items-start
        gap-6
        h-full
      "
    >
      {/* AVATAR */}
      {avatar && (
        <motion.img
          src={avatar}
          alt={character}
          className="
            w-20 h-20
            sm:w-24 sm:h-24
            md:w-28 md:h-28

            rounded-full
            object-cover
            border border-white/30
            shrink-0
          "
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      {/* TEXT */}
      <div className="flex-1 text-center md:text-left">
        <p
          className="
            text-2xl
            sm:text-3xl
            font-bold
            mb-3
          "
        >
          {character}
        </p>

        <p
          className="
            text-lg
            sm:text-xl
            md:text-2xl
            leading-relaxed
            break-words
          "
        >
          {displayText}
          <span className="animate-pulse">▋</span>
        </p>
      </div>
    </div>
  );
}