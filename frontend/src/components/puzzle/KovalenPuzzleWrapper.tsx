import { useEffect, useRef } from "react";
import Phaser from "phaser";
import KovalenPuzzleScene from "../../game/scenes/KovalenPuzzle";
import { useGameStore } from "../../store/useGameStore";

const KovalenPuzzleWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const updateCode = useGameStore((state) => state.updateCode);

  useEffect(() => {
    if (gameRef.current || !containerRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: "#000000",
      scene: [KovalenPuzzleScene],
    });

    // 🔥 LISTENER PHASER → ZUSTAND
    const handleComplete = (event: any) => {
      const code = event.detail;

      console.log("Kovalen selesai:", code);

      // 🔥 MASUK KE GLOBAL STATE
      updateCode("kovalen", code);
    };

    window.addEventListener("puzzleCompleted", handleComplete);

    return () => {
      window.removeEventListener("puzzleCompleted", handleComplete);

      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [updateCode]);

  return (
    <div className="flex justify-center items-center">
      <div ref={containerRef} />
    </div>
  );
};

export default KovalenPuzzleWrapper;