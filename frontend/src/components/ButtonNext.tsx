import { AiOutlineArrowRight } from "react-icons/ai";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NextButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({
  to,
  onClick,
  label = "Next",
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;

    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <motion.button
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleClick}
      className={`
        flex items-center gap-2
        px-4 py-2
        text-white font-medium
        rounded-lg
        transition-all duration-200
        active:scale-95

        ${disabled
          ? "bg-gray-500 cursor-not-allowed opacity-60"
          : "bg-blue-600 hover:bg-blue-700"
        }
      `}
    >
      {label}
      <AiOutlineArrowRight size={20} />
    </motion.button>
  );
};

export default NextButton;