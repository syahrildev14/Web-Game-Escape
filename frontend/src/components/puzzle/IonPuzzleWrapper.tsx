import { useEffect, useRef } from "react";
import Phaser from "phaser";
import IonPuzzle from "../../game/scenes/IonPuzzle";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const IonPuzzleWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

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

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full overflow-hidden" />;
};

export default IonPuzzleWrapper;
