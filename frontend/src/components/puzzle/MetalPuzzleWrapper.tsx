import { useEffect, useRef } from "react";
import Phaser from "phaser";
import MetalPuzzle from "../../game/scenes/MetalPuzzle";
import { useGameStore } from "../../store/useGameStore";

const MetalPuzzleWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const updateCode = useGameStore((state) => state.updateCode);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: "#0b0f14",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
      },
      scene: [MetalPuzzle],
    });

    // 🔥 LISTENER PHASER → ZUSTAND
    const handleComplete = (event: any) => {
      const code = event.detail;

      console.log("Metal selesai:", code);

      // 🔥 SIMPAN KE GLOBAL STATE
      updateCode("metal", code);
    };

    window.addEventListener("puzzleCompleted", handleComplete);

    return () => {
      window.removeEventListener("puzzleCompleted", handleComplete);

      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [updateCode]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      ref={containerRef}
    />
  );
};

export default MetalPuzzleWrapper;