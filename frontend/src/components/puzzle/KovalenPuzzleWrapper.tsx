import { useEffect, useRef } from "react";
import Phaser from "phaser";
import KovalenPuzzleScene from "../../game/scenes/KovalenPuzzle";

const KovalenPuzzleWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

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

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div ref={containerRef} />
    </div>
  );
};

export default KovalenPuzzleWrapper;
