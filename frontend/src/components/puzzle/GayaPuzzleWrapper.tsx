import { useEffect } from "react";
import Phaser from "phaser";
import GayaAntarmolekulScene from "../../game/scenes/GayaPuzzle";

export default function GayaPuzzleWrapper() {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 500,
      parent: "phaser-container",
      backgroundColor: "#f5f5f5",
      scene: [GayaAntarmolekulScene],
    });

    game.scene
      .getScene("GayaAntarmolekulScene")
      ?.events.on("PUZZLE_SOLVED", (code: string) => {
        alert(`🔐 Kode Akhir: ${code}`);
      });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" />;
}
