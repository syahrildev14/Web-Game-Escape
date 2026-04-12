import { useEffect, useRef } from "react";
import Phaser from "phaser";
import GayaAntarmolekulScene from "../../game/scenes/GayaPuzzle";
import { useGameStore } from "../../store/useGameStore";

export default function GayaPuzzleWrapper() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const setCode = useGameStore((state) => state.setCode);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 500,
      parent: containerRef.current,
      backgroundColor: "#f5f5f5",
      scene: [GayaAntarmolekulScene],
    });

    // 🔥 LISTENER PHASER → ZUSTAND
    const handleComplete = (event: any) => {
      const code = event.detail;

      console.log("Gaya puzzle selesai:", code);

      // 🔥 SIMPAN KE GLOBAL STATE
      setCode("gaya", code);
    };

    window.addEventListener("puzzleCompleted", handleComplete);

    return () => {
      window.removeEventListener("puzzleCompleted", handleComplete);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [setCode]);

  return <div ref={containerRef} />;
}