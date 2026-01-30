import { AiOutlineArrowLeft } from "react-icons/ai";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface BackButtonProps {
  to?: string; // tujuan halaman (opsional)
  onClick?: () => void; // event custom (opsional)
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  onClick,
  label = "Back",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(); // jalankan fungsi custom lebih dulu

    if (to) {
      navigate(to); // kalau ada tujuan spesifik
    } else {
      navigate(-1); // default: kembali ke halaman sebelumnya
    }
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
      <AiOutlineArrowLeft size={20} />
      {label}
    </motion.button>
  );
};

export default BackButton;
