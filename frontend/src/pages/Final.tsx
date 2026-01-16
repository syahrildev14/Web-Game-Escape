import { useState } from "react";
import { useNavigate } from "react-router-dom";

import bgOff from "../assets/background/rusak.jpeg";
import bgOn from "../assets/background/good.jpeg";
import { motion } from "framer-motion";

const TOTAL_PUZZLES = 6;
const FINAL_CODE = "123456";

export default function StabilizerInputPage() {
  const navigate = useNavigate();

  const [codes, setCodes] = useState<string[]>(Array(TOTAL_PUZZLES).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...codes];
    next[index] = value;
    setCodes(next);
  };

  const handleSubmit = () => {
    if (codes.some((c) => c === "")) {
      setError("Semua kode harus diisi");
      return;
    }

    const finalCode = codes.join("");

    if (finalCode === FINAL_CODE) {
      setError(null);
      setActivated(true);
    } else {
      setError("Kode salah. Stabilizer belum aktif!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${activated ? bgOn : bgOff})`,
      }}
    >
      <div className="bg-white/50 backdrop-blur rounded-2xl shadow-xl p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-4">
          Stabilizer Energi
        </h1>

        {/* FORM INPUT */}
        {!activated && (
          <>
            <p className="text-center text-gray-600 mb-6">
              Masukkan 6 kode dari puzzle yang telah kamu selesaikan
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {codes.map((code, i) => (
                <input
                  key={i}
                  value={code}
                  onChange={(e) => handleChange(i, e.target.value)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold duration-300"
            >
              Aktifkan Stabilizer
            </button>
          </>
        )}

        {/* DIALOG DR. ION */}
        {activated && (
          <div className="text-center mt-6 animate-fade-in">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              ⚡ Stabilizer Aktif!
            </h2>

            <p className="italic text-gray-700 mb-6">
              “Kerja yang luar biasa, Agen! Laboratorium telah stabil. Kamu
              telah menguasai ikatan kimia dan menyelamatkan
              <strong> ChemLab Academy!</strong>”
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/refleksi")}
              className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Lanjut ke Refleksi
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
