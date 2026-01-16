import Phaser from "phaser";

import bgStar from "../../assets/background/bgdim.jpg";
import atomC from "../../assets/utils/atom.svg";
import electronDot from "../../assets/kovalen/h2.svg";
import slotImg from "../../assets/kovalen/slot1.svg";

export default class LewisPuzzle extends Phaser.Scene {
  private correctPlaced = 0;
  private totalElectrons = 4; // contoh: karbon (4 elektron valensi)

  constructor() {
    super("LewisPuzzle");
  }

  preload(): void {
    this.load.image("bg", bgStar);
    this.load.image("carbon", atomC);
    this.load.image("electron", electronDot);
    this.load.image("slot", slotImg);
  }

  create(): void {
    /** 🌌 Background */
    this.add.image(400, 300, "bg").setDisplaySize(800, 600);

    /** 🧪 Narasi */
    this.add
      .text(
        400,
        30,
        "“Atom-atom ini kehilangan strukturnya!\nKembalikan konfigurasi Lewis mereka!” — Dr. Ion",
        {
          fontSize: "20px",
          color: "#c7f3ff",
          align: "center",
          fontFamily: "Poppins",
          wordWrap: { width: 720 },
        }
      )
      .setOrigin(0.5, 0);

    /** ⚛️ Atom */
    this.add.image(400, 320, "carbon").setScale(0.9);

    /** 🎯 Slot Elektron */
    const slots = [
      this.createSlot(400, 220),
      this.createSlot(500, 320),
      this.createSlot(400, 420),
      this.createSlot(300, 320),
    ];

    /** ⭐ Elektron Acak */
    for (let i = 0; i < this.totalElectrons; i++) {
      this.createElectron(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(150, 550),
        slots
      );
    }
  }

  /** SLOT */
  private createSlot(x: number, y: number) {
    const slot = this.add.image(x, y, "slot").setAlpha(0.4);
    slot.setData("filled", false);
    return slot;
  }

  /** ELEKTRON */
  private createElectron(
    x: number,
    y: number,
    slots: Phaser.GameObjects.Image[]
  ) {
    const dot = this.add.image(x, y, "electron").setInteractive();
    dot.setScale(0.6);

    this.input.setDraggable(dot);

    this.input.on(
      "drag",
      (
        _p: Phaser.Input.Pointer,
        target: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number
      ) => {
        if (target === dot) {
          target.x = dragX;
          target.y = dragY;
        }
      }
    );

    this.input.on(
      "dragend",
      (_p: Phaser.Input.Pointer, target: Phaser.GameObjects.Image) => {
        if (target !== dot) return;

        for (const slot of slots) {
          if (
            !slot.getData("filled") &&
            Phaser.Math.Distance.Between(dot.x, dot.y, slot.x, slot.y) < 40
          ) {
            dot.disableInteractive();
            dot.setPosition(slot.x, slot.y);
            slot.setData("filled", true);
            this.markCorrect();
            return;
          }
        }

        // Salah → balik
        this.tweens.add({
          targets: dot,
          x,
          y,
          duration: 300,
          ease: "Back.easeOut",
        });
      }
    );
  }

  /** ✔️ CEK SELESAI */
  private markCorrect() {
    this.correctPlaced++;

    if (this.correctPlaced === this.totalElectrons) {
      this.finishPuzzle();
    }
  }

  /** 🔐 SELESAI */
  private finishPuzzle() {
    this.add
      .text(400, 560, "Struktur Lewis Lengkap!\nCode: 4", {
        fontSize: "28px",
        color: "#00ffd5",
        fontFamily: "Poppins",
        align: "center",
      })
      .setOrigin(0.5);

    this.events.emit("puzzleCompleted", "L");
  }
}
