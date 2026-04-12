import { useEffect, useRef } from "react";
import Phaser from "phaser";
import LewisPuzzle from "../../game/scenes/LewisPuzzle";
import { useGameStore } from "../../store/useGameStore";

const LewisPuzzleWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const setCode = useGameStore((state) => state.setCode);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
      },
      scene: [LewisPuzzle],
    });

    // 🔥 LISTENER PHASER → ZUSTAND
    const handleComplete = (event: any) => {
      const code = event.detail;

      console.log("Lewis selesai:", code);

      // 🔥 SIMPAN KE GLOBAL STATE
      setCode("lewis", code);
    };

    window.addEventListener("puzzleCompleted", handleComplete);

    return () => {
      window.removeEventListener("puzzleCompleted", handleComplete);

      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [setCode]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
};

export default LewisPuzzleWrapper;