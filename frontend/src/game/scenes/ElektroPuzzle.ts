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
    /** Background */
    this.add.image(400, 300, "bg").setDisplaySize(800, 600).setAlpha(0.85);

    /** Narasi */
    this.add
      .text(
        400,
        20,
        "“Elektronegativitas menentukan polaritas.\nMana yang lebih menarik elektron?” — Dr. Ion",
        {
          fontSize: "20px",
          color: "#9efcff",
          align: "center",
          wordWrap: { width: 700 },
        }
      )
      .setOrigin(0.5, 0);

    this.add
      .text(400, 85, "Seret pasangan atom ke POLAR atau NONPOLAR", {
        fontSize: "22px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    /** SLOT */
    this.createSlot(250, 400, "polar");
    this.createSlot(550, 400, "nonpolar");

    /** PASANGAN ATOM */
    this.pairs.forEach((pair, index) => {
      this.createDraggable(200 + index * 140, 520, pair);
    });
  }

  private createSlot(x: number, y: number, type: "polar" | "nonpolar") {
    const slot = this.add.image(x, y, type).setAlpha(0.95);
    slot.setData("type", type);
  }

  private createDraggable(x: number, y: number, config: PairConfig) {
    const obj = this.add.image(x, y, config.key).setInteractive();
    obj.setData("answer", config.answer);

    this.input.setDraggable(obj);

    this.input.on(
      "drag",
      (
        _: Phaser.Input.Pointer,
        target: Phaser.GameObjects.Image,
        dragX: number,
        dragY: number
      ) => {
        if (target === obj) {
          target.x = dragX;
          target.y = dragY;
        }
      }
    );

    this.input.on(
      "dragend",
      (_: Phaser.Input.Pointer, target: Phaser.GameObjects.Image) => {
        this.checkDrop(target);
      }
    );
  }

  private checkDrop(obj: Phaser.GameObjects.Image) {
    const answer = obj.getData("answer") as "polar" | "nonpolar";

    const slots = this.children
      .getAll()
      .filter((o) => o.getData("type")) as Phaser.GameObjects.Image[];

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

  private markCorrect(
    obj: Phaser.GameObjects.Image,
    slot: Phaser.GameObjects.Image
  ) {
    obj.disableInteractive();
    obj.setPosition(slot.x, slot.y - 40);
    obj.setTint(0x00ffcc);

    this.correctCount++;

    if (this.correctCount === this.totalPairs) {
      this.finishPuzzle();
    }
  }

  private resetPosition(obj: Phaser.GameObjects.Image) {
    this.tweens.add({
      targets: obj,
      y: 520,
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  private finishPuzzle() {
    this.add
      .text(400, 560, "Puzzle Selesai!\nCode: 3", {
        fontSize: "26px",
        color: "#00ffe1",
        align: "center",
      })
      .setOrigin(0.5);

    this.events.emit("puzzleCompleted", "Code: 3");
  }
}
