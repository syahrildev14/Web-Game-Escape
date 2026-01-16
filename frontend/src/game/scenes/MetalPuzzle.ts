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
    /** 🪙 Background metalik */
    this.add.image(400, 300, "bg").setDisplaySize(800, 600);

    /** 🌊 Lautan elektron (animasi) */
    const sea = this.add
      .image(400, 330, "sea")
      .setAlpha(0.4)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.tweens.add({
      targets: sea,
      alpha: { from: 0.25, to: 0.45 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    /** 🧠 Narasi */
    this.add
      .text(
        400,
        30,
        "“Ikatan logam bergantung pada lautan elektron delokalisasi.\nAtur kembali kisi logam ini!” — Dr. Ion",
        {
          fontSize: "20px",
          color: "#d0f4ff",
          align: "center",
          fontFamily: "Poppins",
          wordWrap: { width: 720 },
        }
      )
      .setOrigin(0.5, 0);

    /** SLOT KONSEP */
    const slots = [
      this.createSlot(520, 180, "Konduktivitas listrik"),
      this.createSlot(520, 260, "Konduktivitas panas"),
      this.createSlot(520, 340, "Dapat ditempa"),
      this.createSlot(520, 420, "Dapat ditarik"),
    ];

    /** KARTU SIFAT */
    const cards = [
      { text: "Elektron bebas bergerak", accept: 0 },
      { text: "Energi mudah berpindah", accept: 1 },
      { text: "Lapisan ion bergeser", accept: 2 },
      { text: "Ikatan tidak kaku", accept: 3 },
    ];

    cards.forEach((c, i) => {
      this.createCard(180, 180 + i * 80, c.text, c.accept, slots);
    });
  }

  /** SLOT */
  private createSlot(x: number, y: number, label: string) {
    const slot = this.add.image(x, y, "slot");
    slot.setData("index", label);

    this.add.text(x, y, label, {
      fontSize: "14px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 140 },
    }).setOrigin(0.5);

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
    card.setData("accept", acceptIndex);

    const label = this.add.text(x, y, text, {
      fontSize: "14px",
      color: "#000",
      align: "center",
      wordWrap: { width: 120 },
    }).setOrigin(0.5);

    this.input.setDraggable(card);

    this.input.on(
      "drag",
      (
        _p: Phaser.Input.Pointer,
        target: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number
      ) => {
        if (target === card) {
          target.setPosition(dragX, dragY);
          label.setPosition(dragX, dragY);
        }
      }
    );

    this.input.on(
      "dragend",
      (
        _p: Phaser.Input.Pointer,
        target: Phaser.GameObjects.Image
      ) => {
        if (target !== card) return;

        slots.forEach((slot, index) => {
          if (
            Phaser.Math.Distance.Between(card.x, card.y, slot.x, slot.y) < 60 &&
            card.getData("accept") === index
          ) {
            card.disableInteractive();
            card.setPosition(slot.x, slot.y);
            label.setPosition(slot.x, slot.y);
            this.markCorrect();
          }
        });
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
    this.add
      .text(400, 560, "Kisi Logam Stabil!\nCode: 5", {
        fontSize: "28px",
        color: "#00fff2",
        align: "center",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.events.emit("puzzleCompleted", "Code: 5");
  }
}
