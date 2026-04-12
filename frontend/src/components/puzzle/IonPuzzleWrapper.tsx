import { useEffect, useRef } from "react";
import Phaser from "phaser";
import IonPuzzle from "../../game/scenes/IonPuzzle";
import { useGameStore } from "../../store/useGameStore";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

interface IonPuzzleWrapperProps {
  onComplete?: () => void; // 🔥 TAMBAHAN
}

const IonPuzzleWrapper: React.FC<IonPuzzleWrapperProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
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
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      },
      scene: [IonPuzzle],
    });

    // 🔥 LISTENER DARI PHASER
    const handleComplete = (event: any) => {
      const code = event.detail;

      console.log("Ion puzzle selesai:", code);

      // ✅ simpan ke zustand
      setCode("ion", code);

      // 🔥 trigger ke React (MenuSelection)
      if (onComplete) onComplete();
    };

    window.addEventListener("puzzleCompleted", handleComplete);

    return () => {
      window.removeEventListener("puzzleCompleted", handleComplete);

      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [setCode, onComplete]);

  return <div ref={containerRef} className="w-full h-full overflow-hidden" />;
};

export default IonPuzzleWrapper;