import { useState } from "react";
import BgImage from "../assets/background/intro.svg";
import DialogBox from "../components/DialogueBox";
import avatar from "../assets/avatar.png";

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  return (
    <div
      className="text-white flex flex-col justify-center items-center space-y-10"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >

      <div className="flex-col space-x-4">
        {/* Button Mulai */}
        <button
          onClick={() => setShowModal(true)}
          className="
          inline-block
          mt-20
          px-6 py-4
          bg-white
          text-pink-950
          font-semibold
          rounded-xl
          shadow-[0_8px_0_#be185d,0_12px_20px_rgba(0,0,0,0.25)]
          transition-all
          hover:-translate-y-1
          active:translate-y-2
        "
        >
          Mulai Sekarang 🚀
        </button>

        {/* PLAY VIDEO */}
        <button
          onClick={() => setShowModal(true)}
          className="
          inline-block
          mt-20
          px-6 py-4
          bg-yellow-600
          text-white
          font-semibold
          rounded-xl
          shadow-[0_8px_0_#be185d,0_12px_20px_rgba(0,0,0,0.25)]
          transition-all
          hover:-translate-y-1
          active:translate-y-2
        "
        >
          Play Video ▶
        </button>
      </div>

      {/* Dialog Narasi */}
      <DialogBox
        character="Dr. Ion"
        avatar={avatar}
        dialog={[
          "Selamat datang, Agen!",
          "Sistem laboratorium mengalami ketidakstabilan molekuler.",
          "Hanya pemahamanmu tentang ikatan kimia yang dapat menyelamatkan tempat ini.",
          "Selesaikan 6 tantangan dan kumpulkan seluruh kode.",
          "Waktu terus berjalan!",
          "Mulai dari Ruang ION, Semangat!",
        ]}
        onFinish={() => console.log("Dialog selesai")}
      />

      {/* MODAL INPUT NAMA */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-80">
            <h2 className="text-lg font-semibold text-center text-black">
              Masukkan Nama
            </h2>

            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg text-gray-800 font-semibold"
              placeholder="Nama kamu"
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={() => {
                if (!name.trim()) return;
                localStorage.setItem("playerName", name);
                window.location.href = "/ion";
              }}
              className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {/* ===== Modal Video ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-black rounded-xl overflow-hidden w-[100%] max-w-3xl">

            {/* Tombol Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white text-xl z-50 w-10 h-10 rounded-full bg-violet-500 hover:scale-105 duration-200 shadow-lg shadow-black/40"
            >
              ✕
            </button>

            {/* Video */}
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/_WRanc99nUQ?si=W0MntwCtGlmvBSbs"
              title="YouTube video"
              allow="autoplay"
              allowFullScreen
            />

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
