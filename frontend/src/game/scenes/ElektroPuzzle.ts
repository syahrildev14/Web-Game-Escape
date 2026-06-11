import Phaser from "phaser";

import bg from "../../assets/background/bgdim.jpg";
import polarSlot from "../../assets/utils/atom.svg";
import nonpolarSlot from "../../assets/kovalen/slot1.svg";

import hcl from "../../assets/kovalen/o2.svg";
import ch from "../../assets/kovalen/slot1.svg";
import oh from "../../assets/kovalen/double.svg";
import oo from "../../assets/kovalen/co2.svg";

interface PairConfig {
  key: string;
  answer: "polar" | "nonpolar";
}

export default class ElektroPuzzle extends Phaser.Scene {
  private correctCount = 0;
  private totalPairs = 4;

  private pairs: PairConfig[] = [
    { key: "hcl", answer: "polar" },
    { key: "oh", answer: "polar" },
    { key: "ch", answer: "nonpolar" },
    { key: "oo", answer: "nonpolar" },
  ];

  constructor() {
    super("ElektroPuzzle");
  }

  preload(): void {
    this.load.image("bg", bg);
    this.load.image("polar", polarSlot);
    this.load.image("nonpolar", nonpolarSlot);

    this.load.image("hcl", hcl);
    this.load.image("ch", ch);
    this.load.image("oh", oh);
    this.load.image("oo", oo);
  }

  create(): void {
    // ================= BACKGROUND =================
    this.add
      .image(400, 300, "bg")
      .setDisplaySize(800, 600)
      .setAlpha(0.8);

    // ================= PANEL INSTRUKSI =================
    const infoBox = this.add.rectangle(
      400,
      95,
      720,
      120,
      0x000000,
      0.55
    );

    infoBox.setStrokeStyle(2, 0x4ade80);

    this.add
      .text(400, 40, "Puzzle Polaritas Molekul", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Poppins",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        400,
        75,
        "Tugas: Kelompokkan pasangan atom berdasarkan polaritas ikatannya.",
        {
          fontSize: "16px",
          color: "#facc15",
          fontFamily: "Poppins",
          align: "center",
          wordWrap: { width: 650 },
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        400,
        110,
        "1. Seret pasangan atom.\n2. Letakkan ke area Polar atau Nonpolar.\n3. Jika benar objek akan berubah menjadi hijau.",
        {
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: "Poppins",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // ================= LABEL =================
    this.add
      .text(250, 210, "IKATAN POLAR", {
        fontSize: "22px",
        color: "#60a5fa",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.add
      .text(550, 210, "IKATAN NONPOLAR", {
        fontSize: "22px",
        color: "#86efac",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    // ================= SLOT =================
    this.createSlot(250, 340, "polar");
    this.createSlot(550, 340, "nonpolar");

    // ================= GLOBAL DRAG =================
    this.input.on(
      "drag",
      (
        _pointer: Phaser.Input.Pointer,
        obj: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number
      ) => {
        obj.x = dragX;
        obj.y = dragY;
      }
    );

    this.input.on(
      "dragend",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
        this.checkDrop(obj);
      }
    );

    // ================= DRAGGABLE =================
    this.pairs.forEach((pair, index) => {
      this.createDraggable(140 + index * 170, 530, pair);
    });
  }

  // ================= SLOT =================
  private createSlot(x: number, y: number, type: "polar" | "nonpolar") {
    const slot = this.add.image(x, y, type).setAlpha(0.95);
    slot.setData("type", type);
  }

  // ================= DRAG =================
  private createDraggable(
    x: number,
    y: number,
    config: PairConfig
  ) {
    const obj = this.add.image(x, y, config.key).setInteractive();

    obj.setData("answer", config.answer);
    obj.setData("startX", x);
    obj.setData("startY", y);

    this.input.setDraggable(obj);

    this.tweens.add({
      targets: obj,
      angle: { from: -5, to: 5 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return obj;
  }

  // ================= CHECK =================
  private checkDrop(obj: Phaser.GameObjects.Image) {
    const answer = obj.getData("answer");

    const slots = this.children
      .getAll()
      .filter((o: any) => o.getData("type")) as Phaser.GameObjects.Image[];

    for (const slot of slots) {
      const type = slot.getData("type");

      if (Phaser.Math.Distance.Between(obj.x, obj.y, slot.x, slot.y) < 70) {
        if (type === answer) {
          this.markCorrect(obj, slot);
          return;
        }
      }
    }

    this.resetPosition(obj);
  }

  // ================= CORRECT =================
  private markCorrect(
    obj: Phaser.GameObjects.Image,
    slot: Phaser.GameObjects.Image
  ) {
    obj.disableInteractive();

    obj.setPosition(slot.x, slot.y - 50);

    obj.setTint(0x00ff99);

    this.correctCount++;

    if (this.correctCount >= this.totalPairs) {
      this.finishPuzzle();
    }
  }

  // ================= RESET =================
  private resetPosition(obj: Phaser.GameObjects.Image) {
    this.tweens.add({
      targets: obj,
      x: obj.getData("startX"),
      y: obj.getData("startY"),
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // ================= FINISH =================
  private finishPuzzle() {
    const panel = this.add.rectangle(
      400,
      560,
      260,
      50,
      0x00aa44,
      0.9
    );

    panel.setStrokeStyle(2, 0xffffff);

    this.add
      .text(400, 560, "✓ Puzzle Selesai", {
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "C",
        })
      );
    });
  }
}