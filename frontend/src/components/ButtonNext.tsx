import { AiOutlineArrowRight } from "react-icons/ai";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NextButtonProps {
  to?: string; // tujuan halaman (opsional)
  onClick?: () => void; // event custom (opsional)
  label?: string;
}

const NextButton: React.FC<NextButtonProps> = ({
  to,
  onClick,
  label = "Next",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(); // jalankan fungsi custom lebih dulu
    if (to) navigate(to); // lalu navigasi jika ada tujuan
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="
        flex items-center gap-2 
        px-4 py-2 
        bg-blue-600 hover:bg-blue-700 
        text-white font-medium 
        rounded-lg 
        transition-all duration-200
        active:scale-95
      "
    >
      {label}
      <AiOutlineArrowRight size={20} />
    </motion.button>
  );
};

export default NextButton;
