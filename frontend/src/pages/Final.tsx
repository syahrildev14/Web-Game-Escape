import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useGameStore } from "../store/useGameStore";

import bgOff from "../assets/background/rusak.jpeg";
import bgOn from "../assets/background/good.jpeg";

const TOTAL_PUZZLES = 6;

export default function StabilizerInputPage() {
  const navigate = useNavigate();

  const { fetchCodes } = useGameStore();

  const [codes, setCodes] = useState<string[]>(
    Array(TOTAL_PUZZLES).fill("")
  );

  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // FETCH DATA DARI BACKEND
  // Tetap dipanggil untuk validasi backend,
  // tapi kode TIDAK ditampilkan ke user
  useEffect(() => {
    fetchCodes();
  }, []);

  const handleChange = (
    index: number,
    value: string
  ) => {
    // hanya angka 1 digit
    if (!/^\d?$/.test(value)) return;

    const next = [...codes];
    next[index] = value;
    setCodes(next);

    // AUTO FOCUS KE INPUT BERIKUTNYA
    if (value && index < TOTAL_PUZZLES - 1) {
      const nextInput = document.getElementById(
        `code-input-${index + 1}`
      );

      if (nextInput instanceof HTMLInputElement) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setError(null);

    if (codes.some((c) => c === "")) {
      setError("Semua kode harus diisi");
      return;
    }

    const finalCode = codes.join("");

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/stabilizer/validate-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: finalCode,
          }),
        }
      );

      const data: { success: boolean } =
        await res.json();

      if (data.success) {
        setActivated(true);
      } else {
        setError(
          "Kode salah. Stabilizer belum aktif!"
        );
      }
    } catch (err) {
      setError("Server error, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-cover
        bg-center
        transition-all
        duration-700
        px-4
        py-6
      "
      style={{
        backgroundImage: `url(${activated ? bgOn : bgOff
          })`,
      }}
    >
      {/* CARD */}
      <div
        className="
          bg-white/40
          backdrop-blur-xl
          border border-white/30
          shadow-2xl
          rounded-3xl

          w-full
          max-w-2xl

          p-6
          sm:p-8
          md:p-10
        "
      >
        {/* TITLE */}
        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-center
            mb-4
            text-black
          "
        >
          Stabilizer Energi
        </h1>

        {!activated && (
          <>
            {/* DESCRIPTION */}
            <p
              className="
                text-center
                text-gray-700
                mb-8

                text-sm
                sm:text-base
                leading-relaxed
              "
            >
              Masukkan 6 kode dari puzzle
              yang telah kamu selesaikan
            </p>

            {/* INPUT CODE */}
            <div
              className="
                grid
                grid-cols-3
                sm:grid-cols-6
                gap-3
                sm:gap-4
                mb-8
              "
            >
              {codes.map((code, i) => (
                <input
                  key={i}
                  id={`code-input-${i}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={code}
                  onChange={(e) =>
                    handleChange(
                      i,
                      e.target.value
                    )
                  }
                  maxLength={1}
                  className="
                    w-full
                    aspect-square

                    text-center
                    text-xl
                    sm:text-2xl
                    font-bold

                    border
                    border-gray-300

                    rounded-xl

                    bg-white/80
                    backdrop-blur

                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-400/50
                    focus:border-blue-500

                    transition-all
                    duration-200
                  "
                />
              ))}
            </div>

            {/* ERROR */}
            {error && (
              <p
                className="
                  text-red-600
                  text-center
                  mb-5
                  font-medium
                  text-sm
                  sm:text-base
                "
              >
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                w-full

                bg-blue-800
                hover:bg-blue-700

                text-white

                py-3
                sm:py-4

                rounded-2xl

                font-semibold
                text-sm
                sm:text-lg

                duration-300

                disabled:opacity-50
                disabled:cursor-not-allowed

                shadow-lg
              "
            >
              {loading
                ? "Memproses..."
                : "Aktifkan Stabilizer"}
            </button>
          </>
        )}

        {/* SUCCESS */}
        {activated && (
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center mt-6"
          >
            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-green-600
                mb-5
              "
            >
              ⚡ Stabilizer Aktif!
            </h2>

            <p
              className="
                italic
                text-gray-800
                mb-8

                text-sm
                sm:text-lg
                leading-relaxed
              "
            >
              “Kerja yang luar biasa, Agen!
              Laboratorium telah stabil.
              Kamu telah menguasai ikatan
              kimia dan menyelamatkan
              <strong>
                {" "}
                ChemLab Academy!
              </strong>
              ”
            </p>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() =>
                navigate("/refleksi")
              }
              className="
                bg-blue-800
                hover:bg-blue-700

                text-white

                px-6
                py-3

                rounded-2xl

                font-semibold
                text-sm
                sm:text-lg

                shadow-lg
              "
            >
              Lanjut ke Refleksi
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}