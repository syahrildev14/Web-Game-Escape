import { motion } from "framer-motion";
import GradientBlinds from "../components/GradientBlind";
import { useState } from "react";

export default function Refleksi() {
  const [form, setForm] = useState({
    learned: "",
    challenge_text: "",
    strategy: "",
    rating: "",
  });

  // Handle Submit Form Refleksi
  const handleSubmit = async () => {
    if (
      !form.learned ||
      !form.challenge_text ||
      !form.strategy ||
      !form.rating
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    const playerName = localStorage.getItem("playerName");

    console.log("playerName:", playerName);

    if (!playerName) {
      alert("Nama pemain tidak ditemukan");
      return;
    }

    const payload = {
      player_name: playerName,
      learned: form.learned,
      challenge_text: form.challenge_text,
      strategy: form.strategy,
      rating: Number(form.rating),
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        "http://localhost:5000/api/reflections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Status:", response.status);

      const data = await response.json();

      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan refleksi");
      }

      alert(data.message);

      setForm({
        learned: "",
        challenge_text: "",
        strategy: "",
        rating: "",
      });
    } catch (error) {
      console.error("ERROR:", error);
      alert("Gagal menyimpan refleksi");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* BACKGROUND CONTAINER (RELATIVE CONTEXT) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GradientBlinds
          gradientColors={["#FF9FFC", "#5227FF"]}
          angle={0}
          noise={0.2}
          blindCount={8}
          blindMinWidth={60}
          spotlightRadius={0.7}
          spotlightSoftness={1.2}
          spotlightOpacity={0.85}
          mouseDampening={0.15} // makin kecil = makin responsif
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl w-full bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold mb-4 text-center">
            Refleksi Pemain – Web Game Escape
          </h1>

          <p className="text-slate-300 mb-6 text-center">
            Halaman ini membantu pemain merefleksikan pengalaman, strategi, dan
            pemahaman setelah menyelesaikan game escape.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                🧠 Apa yang Saya Pelajari
              </h2>
              <textarea
                name="learned"
                value={form.learned}
                onChange={handleChange}
                placeholder="Tuliskan hal-hal baru yang kamu pelajari dari game ini..."
                className="w-full min-h-[120px] rounded-xl bg-slate-800/80 border border-slate-700 p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                🔍 Tantangan yang Dihadapi
              </h2>
              <textarea
                name="challenge_text"
                value={form.challenge_text}
                onChange={handleChange}
                placeholder="Puzzle atau tantangan apa yang paling sulit? Mengapa?"
                className="w-full min-h-[120px] rounded-xl bg-slate-800/80 border border-slate-700 p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                💡 Strategi & Solusi
              </h2>
              <textarea
                name="strategy"
                value={form.strategy}
                onChange={handleChange}
                placeholder="Strategi apa yang kamu gunakan untuk menyelesaikan game?"
                className="w-full min-h-[120px] rounded-xl bg-slate-800/80 border border-slate-700 p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                ⭐ Penilaian Pengalaman
              </h2>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 p-3 text-slate-100"
              >
                <option value="">Pilih penilaian</option>
                <option value="5">Sangat Menarik</option>
                <option value="4">Menarik</option>
                <option value="3">Cukup</option>
                <option value="2">Kurang Menarik</option>
                <option value="1">Tidak Menarik</option>
              </select>
            </section>
          </div>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg"
          >
            Simpan Refleksi
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
