import { useState } from "react";
import MenuSelection from "../components/MenuSelection";
import BgImage from "../assets/background/ion.jpeg";
import IonPuzzleWrapper from "../components/puzzle/IonPuzzleWrapper";
import NextButton from "../components/ButtonNext";
import DialogBox from "../components/DialogueBox";
import FinalDialogue from "../components/FinalDialogue";
import avatar from "../assets/avatar.png";
import Marquee from "../components/Marquee";
import axios from "axios";

const RoomIon: React.FC = () => {

  const [showFinalDialog, setShowFinalDialog] = useState(false);

  const pretest = [
    {
      question: "Apa itu ikatan kovalen?",
      options: [
        "Ikatan karena serah terima elektron",
        "Ikatan karena pemakaian bersama elektron",
        "Ikatan antara ion positif dan negatif",
        "Ikatan karena gaya magnet",
      ],
      correctAnswer: 1,
    },
    {
      question: "Ikatan kovalen biasanya terjadi antara...",
      options: [
        "Logam dan nonlogam",
        "Sesama nonlogam",
        "Sesama logam",
        "Ion positif dan ion negatif",
      ],
      correctAnswer: 1,
    },
  ];

  const posttest = [
    {
      question: "Mengapa atom membentuk ikatan kovalen?",
      options: [
        "Untuk mencapai kestabilan elektron",
        "Karena gaya tarik inti kuat",
        "Karena perbedaan muatan",
        "Karena suhu tinggi",
      ],
      correctAnswer: 0,
    },
    {
      question: "Contoh senyawa dengan ikatan kovalen adalah...",
      options: ["NaCl", "KBr", "H₂O", "CaO"],
      correctAnswer: 2,
    },
  ];

  const playerName = localStorage.getItem("playerName");

  type FinishResult = {
    pre: { score: number; answers: number[] };
    post: { score: number; answers: number[] };
  };

  function handleFinish(result: FinishResult) {
    const payload = {
      playerName,
      room: "ion",
      pretestScore: result.pre.score,
      posttestScore: result.post.score,
      answers: {
        pre: result.pre.answers,
        post: result.post.answers,
      }
    };

    axios.post("http://localhost:5000/api/results", payload);
  }




  return (
    <div
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* =============================
          GAME CONTENT
      ============================= */}
      <MenuSelection
        pretestQuestions={pretest}
        posttestQuestions={posttest}
        puzzleGame={<IonPuzzleWrapper />}
        onFinish={handleFinish}
      />

      {/* =============================
              VIDEO PEMBELAJARAN
          ============================= */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: "420px",
          background: "rgba(0,0,0,0.4)",
          padding: "10px",
          borderRadius: "12px",
        }}
      >
        <h1 className="text-white font-semibold text-center p-4">
          Video Materi
        </h1>
        <iframe
          width="100%"
          height="200"
          src="https://www.youtube.com/embed/XjmTfkf8z3c?si=uHXJLsNau1fftfYG"
          title="Video Ikatan Kovalen"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        <iframe
          className="mt-4"
          width="100%"
          height="200"
          src="https://www.youtube.com/embed/XJAs7jPC8pc?si=Esa8vUhxAQ1RRKzJ"
          title="Video Ikatan Kovalen"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Tambah Video Disini */}

      </div>

      {/* =============================
                  MARQUEE INFO
          ============================= */}
      <div style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}>
        <Marquee
          text="Cahaya biru memenuhi ruangan. Ion Na⁺ dan Cl⁻ berputar kacau"
          speed={16}
        />
      </div>

      {/* =============================
          NEXT BUTTON
      ============================= */}
      {!showFinalDialog && (
        <div style={{ position: "absolute", bottom: 20, right: 20 }}>
          <NextButton
            label="Ke Ruangan Berikutnya"
            onClick={() => setShowFinalDialog(true)}
          />
        </div>
      )}

      {/* ==============
          DIALOG AWAL
      ================== */}
      <DialogBox
        character="Dr. Ion"
        avatar={avatar}
        dialog={[
          `Selamat datang, ${playerName}!`,
          "Stabilizer Ion hanya akan aktif jika kamu memahami bagaimana atom berikatan melalui transfer elektron.",
        ]}
      />

      {/* =============================
          FINAL DIALOG (MUNCUL SETELAH KLIK)
      ============================= */}
      {showFinalDialog && (
        <FinalDialogue
          character="Dr. Ion"
          avatar={avatar}
          redirectTo="/kovalen"
          dialog={[
            "Stabilizer telah aktif sempurna.",
            "Seluruh sistem laboratorium kembali stabil.",
            "Kerja luar biasa, Agen.",
            "Silakan lanjut ke ruangan berikutnya.",
          ]}
        />
      )}
    </div>
  );
};

export default RoomIon;
