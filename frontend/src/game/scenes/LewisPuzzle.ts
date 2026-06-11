import Phaser from "phaser";

import bgStar from "../../assets/background/bgdim.jpg";
import atomC from "../../assets/utils/atom.svg";
import electronDot from "../../assets/kovalen/h2.svg";
import slotImg from "../../assets/kovalen/slot1.svg";

export default class LewisPuzzle extends Phaser.Scene {
  private correctPlaced = 0;
  private totalElectrons = 4;

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
      .text(400, 40, "Puzzle Struktur Lewis", {
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
        "Tugas: Lengkapi struktur Lewis atom karbon dengan menempatkan elektron valensi pada posisi yang benar.",
        {
          fontSize: "16px",
          color: "#facc15",
          align: "center",
          fontFamily: "Poppins",
          wordWrap: { width: 650 },
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        400,
        110,
        "1. Seret elektron ke lingkaran kosong.\n2. Setiap posisi hanya dapat diisi satu elektron.\n3. Lengkapi seluruh elektron valensi karbon.",
        {
          fontSize: "14px",
          color: "#ffffff",
          align: "center",
          fontFamily: "Poppins",
        }
      )
      .setOrigin(0.5);

    // ================= LABEL EDUKASI =================
    this.add
      .text(
        400,
        170,
        "Karbon (C) memiliki 4 elektron valensi yang harus ditempatkan pada struktur Lewis.",
        {
          fontSize: "16px",
          color: "#93c5fd",
          align: "center",
          fontFamily: "Poppins",
        }
      )
      .setOrigin(0.5);

    // ================= ATOM =================
    this.add.image(400, 320, "carbon").setScale(0.9);

    // ================= SLOT =================
    const slots = [
      this.createSlot(400, 220),
      this.createSlot(500, 320),
      this.createSlot(400, 420),
      this.createSlot(300, 320),
    ];

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
      (
        _pointer: Phaser.Input.Pointer,
        obj: Phaser.GameObjects.GameObject
      ) => {
        this.checkDrop(obj as Phaser.GameObjects.Image, slots);
      }
    );

    // ================= ELECTRON =================
    const positions = [
      [180, 520],
      [320, 520],
      [480, 520],
      [620, 520],
    ];

    positions.forEach(([x, y]) => {
      this.createElectron(x, y);
    });
  }

  // ================= SLOT =================
  private createSlot(x: number, y: number) {
    const slot = this.add.image(x, y, "slot");

    slot.setAlpha(0.6);
    slot.setScale(0.8);

    slot.setData("filled", false);

    return slot;
  }

  // ================= ELECTRON =================
  private createElectron(x: number, y: number) {
    const dot = this.add.image(x, y, "electron");

    dot.setInteractive();
    dot.setScale(0.5);

    dot.setData("startX", x);
    dot.setData("startY", y);

    this.input.setDraggable(dot);

    this.tweens.add({
      targets: dot,
      angle: { from: -5, to: 5 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return dot;
  }

  // ================= DROP CHECK =================
  private checkDrop(
    obj: Phaser.GameObjects.Image,
    slots: Phaser.GameObjects.Image[]
  ) {
    for (const slot of slots) {
      if (
        !slot.getData("filled") &&
        Phaser.Math.Distance.Between(
          obj.x,
          obj.y,
          slot.x,
          slot.y
        ) < 50
      ) {
        obj.disableInteractive();

        obj.setPosition(slot.x, slot.y);

        obj.setTint(0x00ff99);

        slot.setData("filled", true);

        this.markCorrect();
        return;
      }
    }

    this.tweens.add({
      targets: obj,
      x: obj.getData("startX"),
      y: obj.getData("startY"),
      duration: 350,
      ease: "Back.easeOut",
    });
  }

  // ================= PROGRESS =================
  private markCorrect() {
    this.correctPlaced++;

    if (this.correctPlaced >= this.totalElectrons) {
      this.finishPuzzle();
    }
  }

  // ================= FINISH =================
  private finishPuzzle() {
    const panel = this.add.rectangle(
      400,
      560,
      300,
      50,
      0x00aa44,
      0.9
    );

    panel.setStrokeStyle(2, 0xffffff);

    this.add
      .text(400, 560, "✓ Struktur Lewis Lengkap", {
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "lewis",
        })
      );
    });
  }
}