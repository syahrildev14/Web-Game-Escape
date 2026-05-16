import { useEffect, useRef } from "react";
import Phaser from "phaser";
import ElektroPuzzle from "../../game/scenes/ElektroPuzzle";
import { useGameStore } from "../../store/useGameStore";

const ElektroPuzzleWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const updateCode = useGameStore((state) => state.updateCode);

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
      scene: [ElektroPuzzle],
    });

    // 🔥 LISTENER PHASER → ZUSTAND
    const handleComplete = (event: any) => {
      const code = event.detail;

      console.log("Elektro selesai:", code);

      // 🔥 SIMPAN KE GLOBAL STATE
      updateCode("elektro", code);
    };

    window.addEventListener("puzzleCompleted", handleComplete);

    return () => {
      window.removeEventListener("puzzleCompleted", handleComplete);

      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [updateCode]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default ElektroPuzzleWrapper;