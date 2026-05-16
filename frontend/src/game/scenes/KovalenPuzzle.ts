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
    // BACKGROUND
    this.add.image(400, 300, "bg").setDisplaySize(800, 600).setAlpha(0.7);

    // NARASI
    this.add.text(
      400,
      30,
      "“Ikatan kovalen terbentuk saat atom berbagi elektron.”",
      {
        fontSize: "20px",
        color: "#b9eaff",
        align: "center",
        fontFamily: "Poppins",
        wordWrap: { width: 720 },
      }
    ).setOrigin(0.5, 0);

    this.add.text(
      400,
      90,
      "Cocokkan molekul → jenis ikatan & elektron",
      {
        fontSize: "22px",
        color: "#ffffff",
      }
    ).setOrigin(0.5, 0);

    // ================= GLOBAL DRAG EVENTS (FIX UTAMA) =================
    this.input.on(
      "drag",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
        obj.x = dragX;
        obj.y = dragY;
      }
    );

   this.input.on("dragend", (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
  this.checkDrop(obj);
});

    // MOLEKUL
    this.createDraggable(150, 500, "h2", "H2");
    this.createDraggable(400, 500, "o2", "O2");
    this.createDraggable(650, 500, "co2", "CO2");

    // SLOT (FIX: ARRAY ACCEPT)
    this.createSlot(200, 260, "single", ["H2"]);
    this.createSlot(400, 260, "double", ["O2", "CO2"]);

    this.createSlot(260, 160, "e1", ["H2"]);
    this.createSlot(540, 160, "e2", ["O2", "CO2"]);
  }

  // ================= DRAG OBJECT =================
  private createDraggable(x: number, y: number, key: string, tag: string) {
    const obj = this.add.image(x, y, key).setInteractive();

    obj.setData("tag", tag);
    obj.setData("startX", x);
    obj.setData("startY", y);

    this.input.setDraggable(obj);

    this.tweens.add({
      targets: obj,
      angle: { from: -6, to: 6 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return obj;
  }

  // ================= SLOT =================
  private createSlot(x: number, y: number, key: string, accept: string[]) {
    const slot = this.add.image(x, y, key).setAlpha(0.9);
    slot.setData("accept", accept);
    return slot;
  }

  // ================= CHECK =================
  private checkDrop(obj: Phaser.GameObjects.Image) {
    const tag = obj.getData("tag");

    const slots = this.children
      .getAll()
      .filter((c: any) => c.getData("accept")) as Phaser.GameObjects.Image[];

    for (const slot of slots) {
      const accept = slot.getData("accept") as string[];

      const isNear =
        Phaser.Math.Distance.Between(obj.x, obj.y, slot.x, slot.y) < 60;

      if (isNear && accept.includes(tag)) {
        this.markCorrect(obj);
        return;
      }
    }

    // RETURN TO START
    this.tweens.add({
      targets: obj,
      x: obj.getData("startX"),
      y: obj.getData("startY"),
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // ================= CORRECT =================
  private markCorrect(obj: Phaser.GameObjects.Image) {
    obj.disableInteractive();
    obj.setTint(0x00ff99);

    this.correctCount++;

    if (this.correctCount >= this.totalCorrect) {
      this.finishPuzzle();
    }
  }

  // ================= FINISH =================
  private finishPuzzle() {
    this.add.text(400, 560, "Puzzle Selesai!", {
      fontSize: "26px",
      color: "#00ffea",
      fontFamily: "Poppins",
    }).setOrigin(0.5);

    this.time.delayedCall(1200, () => {
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "kovalen",
        })
      );
    });
  }
}