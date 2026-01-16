import Phaser from "phaser";
import IonPuzzle from "./scenes/IonPuzzle";

const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  /** Parent dihapus karena kita pakai React ref */
  parent: undefined,

  /** Ukuran dasar (akan di-scale otomatis) */
  width: 800,
  height: 600,

  backgroundColor: "#111",

  scale: {
    mode: Phaser.Scale.FIT, // auto-resize
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },

  physics: {
    default: "arcade",
    arcade: { debug: false },
  },

  scene: [IonPuzzle],
};

export default phaserConfig;
