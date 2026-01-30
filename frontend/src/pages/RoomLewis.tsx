import MenuSelection from "../components/MenuSelection";
import BgImage from "../assets/background/lewis.jpeg";
import LewisPuzzleWrapper from "../components/puzzle/LewisPuzzleWrapper";
import NextButton from "../components/ButtonNext";
import avatar from "../assets/avatar.png";
import DialogBox from "../components/DialogueBox";
import FinalDialogue from "../components/FinalDialogue";
import { useState } from "react";
import Marquee from "../components/Marquee";
import axios from "axios";
import BackButton from "../components/ButtonBack";

const RoomElektro: React.FC = () => {
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
      room: "lewis",
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
        puzzleGame={<LewisPuzzleWrapper />}
        onFinish={handleFinish}
      />

      

      {/* =============================
                  MARQUEE INFO
          ============================= */}
      <div style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}>
        <Marquee
          text="Atom dengan titik-titik valensi bertebaran seperti bintang"
          speed={16}
        />
      </div>

      {/* =============================
          BACK BUTTON
      ============================= */}
      {!showFinalDialog && (
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <BackButton to="/elektro" />
        </div>
      )}

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
          "Atom-atom ini kehilangan strukturnya! Kembalikan konfigurasi Lewis mereka!",
        ]}
      />

      {/* =============================
          FINAL DIALOG (MUNCUL SETELAH KLIK)
      ============================= */}
      {showFinalDialog && (
        <FinalDialogue
          character="Dr. Ion"
          avatar={avatar}
          redirectTo="/logam"
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

export default RoomElektro;
