import Phaser from "phaser";
import IonPuzzle from "./scenes/IonPuzzle";

const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,

  parent: undefined,

  backgroundColor: "#111",

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  scene: [IonPuzzle],
};

export default phaserConfig;