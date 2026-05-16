import Phaser from "phaser";

import bgMetal from "../../assets/background/bgdim.jpg";
import electronSea from "../../assets/kovalen/slot1.svg";
import cardImg from "../../assets/kovalen/h2.svg";
import slotImg from "../../assets/kovalen/o2.svg";

export default class MetalPuzzle extends Phaser.Scene {
  private correct = 0;
  private total = 4;

  private roomCode: string = "METAL-005";

  constructor() {
    super("MetalPuzzle");
  }

  init(data: any) {
    this.roomCode = data?.roomCode || "METAL-005";
  }

  preload(): void {
    this.load.image("bg", bgMetal);
    this.load.image("sea", electronSea);
    this.load.image("card", cardImg);
    this.load.image("slot", slotImg);
  }

  create(): void {
    this.correct = 0;

    /** 🪙 Background */
    this.add.image(400, 300, "bg").setDisplaySize(800, 600);

    /** 🌊 Electron sea animation */
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
    this.add.text(
      400,
      30,
      "Ikatan logam bergantung pada lautan elektron delokalisasi.\nAtur kembali kisi logam ini!",
      {
        fontSize: "20px",
        color: "#d0f4ff",
        align: "center",
        fontFamily: "Poppins",
        wordWrap: { width: 720 },
      }
    ).setOrigin(0.5);

    /** SLOT */
    const slots = [
      this.createSlot(520, 180, "Konduktivitas listrik"),
      this.createSlot(520, 260, "Konduktivitas panas"),
      this.createSlot(520, 340, "Dapat ditempa"),
      this.createSlot(520, 420, "Dapat ditarik"),
    ];

    /** CARD DATA */
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
    this.add.text(400, 560, `Kisi Logam Stabil!\nCode: ${this.roomCode}`, {
      fontSize: "28px",
      color: "#00fff2",
      align: "center",
      fontFamily: "Poppins",
    }).setOrigin(0.5);

    // 🔥 EVENT UNTUK REACT / ZUSTAND
    this.game.events.emit("puzzleCompleted", this.roomCode);
  }
}