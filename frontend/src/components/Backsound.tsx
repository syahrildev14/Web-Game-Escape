import { useEffect, useRef, useState } from "react";
import backsound from "../assets/music/Aang.mp3";

export default function Backsound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return; 

    if (isOn) {
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isOn]);

  return (
    <>
      <audio ref={audioRef} src={backsound} loop preload="auto" />

      <button
        onClick={() => setIsOn((prev) => !prev)}
        className="fixed top-3 right-5 bg-pink-500 text-white px-4 py-2 rounded-xl shadow-lg z-50"
      >
        {isOn ? "🔊 Sound ON" : "🔇 Sound OFF"}
      </button>
    </>
  );
}
