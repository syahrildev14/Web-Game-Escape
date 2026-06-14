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
  private totalCorrect = 3;

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
    const width = this.scale.width;
    const height = this.scale.height;

    const centerX = width / 2;
    const centerY = height / 2;

    const leftX = width * 0.25;
    const rightX = width * 0.75;

    const row1 = height * 0.38;
    const row2 = height * 0.62;

    const bottomY = height * 0.82;

    this.scale.on("resize", this.handleResize, this);

    console.log("Scene Size:", width, height);

    // ================= BACKGROUND =================
    this.add
      .image(centerX, centerY, "bg")
      .setDisplaySize(width, height)
      .setAlpha(0.8);

    // ================= PANEL INSTRUKSI =================
    const infoBox = this.add.rectangle(
      centerX,
      height * 0.16,
      width * 0.85,
      110,
      0x000000,
      0.55
    );

    infoBox.setStrokeStyle(2, 0x4ade80);

    this.add
      .text(centerX, height * 0.06, "Puzzle Ikatan Kovalen", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Poppins",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        centerX,
        height * 0.12,
        "Tugas: Cocokkan molekul dengan jenis ikatan dan representasi elektronnya.",
        {
          fontSize: "16px",
          color: "#facc15",
          fontFamily: "Poppins",
          align: "center",
          wordWrap: { width: width * 0.7 },
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        centerX,
        height * 0.18,
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
      .text(leftX, row1 - 80, "Representasi Elektron", {
        fontSize: "18px",
        color: "#93c5fd",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(rightX, row1 - 80, "Representasi Elektron", {
        fontSize: "18px",
        color: "#93c5fd",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(leftX, row2 - 80, "Ikatan Tunggal", {
        fontSize: "18px",
        color: "#86efac",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(rightX, row2 - 80, "Ikatan Rangkap Dua", {
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
    this.createSlot(leftX, row1, "e1", ["H2"]);
    this.createSlot(rightX, row1, "e2", ["O2", "CO2"]);

    this.createSlot(leftX, row2, "single", ["H2"]);
    this.createSlot(rightX, row2, "double", ["O2", "CO2"]);

    // ================= MOLEKUL =================
    this.createDraggable(width * 0.2, bottomY, "h2", "H2");
    this.createDraggable(width * 0.5, bottomY, "o2", "O2");
    this.createDraggable(width * 0.8, bottomY, "co2", "CO2");
  }

  private handleResize() {
    console.log(
      "Resize:",
      this.scale.width,
      this.scale.height
    );
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