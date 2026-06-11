import Phaser from "phaser";

import bgMetal from "../../assets/background/bgdim.jpg";
import electronSea from "../../assets/kovalen/slot1.svg";
import cardImg from "../../assets/kovalen/h2.svg";
import slotImg from "../../assets/kovalen/o2.svg";

export default class MetalPuzzle extends Phaser.Scene {
  private correct = 0;
  private total = 4;

  constructor() {
    super("MetalPuzzle");
  }


  preload(): void {
    this.load.image("bg", bgMetal);
    this.load.image("sea", electronSea);
    this.load.image("card", cardImg);
    this.load.image("slot", slotImg);
  }

  create(): void {
    this.correct = 0;

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
      .text(400, 40, "Puzzle Ikatan Logam", {
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
        "Tugas: Cocokkan karakteristik logam dengan penjelasan yang tepat.",
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
        "1. Seret kartu penjelasan.\n2. Cocokkan dengan sifat logam yang sesuai.\n3. Semua pasangan harus benar agar kisi logam stabil.",
        {
          fontSize: "14px",
          color: "#ffffff",
          align: "center",
          fontFamily: "Poppins",
        }
      )
      .setOrigin(0.5);

    // ================= ELECTRON SEA =================
    const sea = this.add
      .image(400, 340, "sea")
      .setAlpha(0.3)
      .setScale(1.1)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: sea,
      alpha: { from: 0.2, to: 0.45 },
      duration: 2500,
      repeat: -1,
      yoyo: true,
      ease: "Sine.easeInOut",
    });

    // ================= LABEL AREA =================
    this.add
      .text(180, 165, "PENJELASAN", {
        fontSize: "20px",
        color: "#93c5fd",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.add
      .text(540, 165, "SIFAT LOGAM", {
        fontSize: "20px",
        color: "#86efac",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    // ================= SLOT =================
    const slots = [
      this.createSlot(560, 220, "Konduktivitas listrik"),
      this.createSlot(560, 300, "Konduktivitas panas"),
      this.createSlot(560, 380, "Dapat ditempa"),
      this.createSlot(560, 460, "Dapat ditarik"),
    ];

    // ================= CARD =================
    const cards = [
      { text: "Elektron bebas bergerak", accept: 0 },
      { text: "Energi mudah berpindah", accept: 1 },
      { text: "Lapisan ion bergeser", accept: 2 },
      { text: "Ikatan tidak kaku", accept: 3 },
    ];

    cards.forEach((card, index) => {
      this.createCard(
        180,
        220 + index * 80,
        card.text,
        card.accept,
        slots
      );
    });
  }

  /** SLOT */
  private createSlot(
    x: number,
    y: number,
    label: string
  ) {
    const slot = this.add.image(x, y, "slot");

    slot.setScale(0.9);
    slot.setAlpha(0.85);

    this.add
      .text(x, y, label, {
        fontSize: "14px",
        color: "#ffffff",
        align: "center",
        fontFamily: "Poppins",
        wordWrap: { width: 150 },
      })
      .setOrigin(0.5);

    return slot;
  }

  /** CARD */
  private createCard(
    x: number,
    y: number,
    text: string,
    acceptIndex: number,
    slots: Phaser.GameObjects.Image[]
  ) {
    const card = this.add.image(x, y, "card").setInteractive();
    const label = this.add.text(x, y, text, {
      fontSize: "14px",
      color: "#000",
      align: "center",
      wordWrap: { width: 120 },
    }).setOrigin(0.5);

    card.setData("accept", acceptIndex);

    this.input.setDraggable(card);

    this.input.on(
      "drag",
      (_p: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
        const obj = target as Phaser.GameObjects.Image;

        if (obj !== card) return;

        card.setPosition(dragX, dragY);
        label.setPosition(dragX, dragY);
      }
    );

    this.input.on(
      "dragend",
      (_p: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject) => {
        const obj = target as Phaser.GameObjects.Image;

        if (obj !== card) return;

        let matched = false;

        slots.forEach((slot, index) => {
          const isNear =
            Phaser.Math.Distance.Between(card.x, card.y, slot.x, slot.y) < 60;

          const isCorrect = card.getData("accept") === index;

          if (isNear && isCorrect) {
            card.disableInteractive();
            card.setPosition(slot.x, slot.y);
            label.setPosition(slot.x, slot.y);

            this.markCorrect();
            matched = true;
          }
        });

        if (!matched) {
          this.tweens.add({
            targets: [card, label],
            x: card.getData("startX"),
            y: card.getData("startY"),
            duration: 300,
            ease: "Back.easeOut",
          });
        }
      }
    );
  }

  /** ✔️ CHECK */
  private markCorrect() {
    this.correct++;
    if (this.correct === this.total) this.finishPuzzle();
  }

  /** 🔐 FINISH */
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
      .text(400, 560, "✓ Struktur Logam Lengkap", {
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "logam",
        })
      );
    });
  }
}