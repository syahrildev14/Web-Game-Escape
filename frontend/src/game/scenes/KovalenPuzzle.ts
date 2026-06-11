import Phaser from "phaser";

import h2 from "../../assets/kovalen/h2.svg";
import o2 from "../../assets/kovalen/o2.svg";
import co2 from "../../assets/kovalen/co2.svg";

import slotSingle from "../../assets/kovalen/single.svg";
import slotDouble from "../../assets/kovalen/o2.svg";
import slotE1 from "../../assets/kovalen/h2.svg";
import slotE2 from "../../assets/kovalen/co2.svg";

import bgDim from "../../assets/background/bgdim.jpg";

export default class KovalenPuzzleScene extends Phaser.Scene {
  private correctCount = 0;
  private totalCorrect = 4;

  constructor() {
    super("KovalenPuzzle");
  }

  preload(): void {
    this.load.image("bg", bgDim);

    this.load.image("h2", h2);
    this.load.image("o2", o2);
    this.load.image("co2", co2);

    this.load.image("single", slotSingle);
    this.load.image("double", slotDouble);
    this.load.image("e1", slotE1);
    this.load.image("e2", slotE2);
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
      .text(400, 40, "Puzzle Ikatan Kovalen", {
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
        "Tugas: Cocokkan molekul dengan jenis ikatan dan representasi elektronnya.",
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
        "1. Seret molekul H₂, O₂, atau CO₂.\n2. Letakkan pada gambar yang sesuai.\n3. Jika benar akan berubah menjadi hijau.",
        {
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: "Poppins",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // ================= LABEL AREA =================
    this.add
      .text(220, 170, "Representasi Elektron", {
        fontSize: "18px",
        color: "#93c5fd",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(580, 170, "Representasi Elektron", {
        fontSize: "18px",
        color: "#93c5fd",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(220, 320, "Ikatan Tunggal", {
        fontSize: "18px",
        color: "#86efac",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(580, 320, "Ikatan Rangkap Dua", {
        fontSize: "18px",
        color: "#fca5a5",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

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

    // ================= SLOT =================
    this.createSlot(220, 240, "e1", ["H2"]);
    this.createSlot(580, 240, "e2", ["O2", "CO2"]);

    this.createSlot(220, 390, "single", ["H2"]);
    this.createSlot(580, 390, "double", ["O2", "CO2"]);

    // ================= MOLEKUL =================
    this.createDraggable(150, 540, "h2", "H2");
    this.createDraggable(400, 540, "o2", "O2");
    this.createDraggable(650, 540, "co2", "CO2");
  }

  // ================= DRAGGABLE =================
  private createDraggable(
    x: number,
    y: number,
    key: string,
    tag: string
  ) {
    const obj = this.add.image(x, y, key).setInteractive();

    obj.setData("tag", tag);
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

  // ================= SLOT =================
  private createSlot(
    x: number,
    y: number,
    key: string,
    accept: string[]
  ) {
    const slot = this.add.image(x, y, key);

    slot.setAlpha(0.9);
    slot.setData("accept", accept);

    return slot;
  }

  // ================= CHECK DROP =================
  private checkDrop(obj: Phaser.GameObjects.Image) {
    const tag = obj.getData("tag");

    const slots = this.children
      .getAll()
      .filter((c: any) => c.getData("accept")) as Phaser.GameObjects.Image[];

    for (const slot of slots) {
      const accept = slot.getData("accept") as string[];

      const isNear =
        Phaser.Math.Distance.Between(
          obj.x,
          obj.y,
          slot.x,
          slot.y
        ) < 70;

      if (isNear && accept.includes(tag)) {
        this.markCorrect(obj);
        return;
      }
    }

    // SALAH → KEMBALI
    this.tweens.add({
      targets: obj,
      x: obj.getData("startX"),
      y: obj.getData("startY"),
      duration: 350,
      ease: "Back.easeOut",
    });
  }

  // ================= JAWABAN BENAR =================
  private markCorrect(obj: Phaser.GameObjects.Image) {
    obj.disableInteractive();

    obj.setTint(0x00ff99);

    this.correctCount++;

    if (this.correctCount >= this.totalCorrect) {
      this.finishPuzzle();
    }
  }

  // ================= SELESAI =================
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
          detail: "kovalen",
        })
      );
    });
  }
}