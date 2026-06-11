import Phaser from "phaser";
import plus from "../assets/ion/ion+.svg";
import minus from "../assets/ion/ion-.svg";
import na from "../assets/ion/na+.png";
import cl from "../assets/ion/cl-.png";
import bgBlue from "../assets/ion/cahayabiru.svg";

export default class IonPuzzle extends Phaser.Scene {
  private correctCount = 0;

  constructor() {
    super("IonPuzzle");
  }

  preload(): void {
    this.load.image("na", na);
    this.load.image("cl", cl);
    this.load.image("slotPlus", plus);
    this.load.image("slotMinus", minus);
    this.load.image("bgBlue", bgBlue);
  }

  create(): void {
    // BACKGROUND
    this.add.image(400, 300, "bgBlue")
      .setDisplaySize(800, 600)
      .setAlpha(0.6);

    // TEXT
    this.add.text(
      400,
      30,
      "“Stabilizer Ion hanya aktif jika kamu memahami transfer elektron!” — Dr. Ion",
      {
        fontSize: "20px",
        color: "#aee7ff",
        fontFamily: "Poppins",
        align: "center",
        wordWrap: { width: 700 },
      }
    ).setOrigin(0.5, 0);

    this.add.text(
      400,
      90,
      "Tarik ion ke tempat yang benar!",
      {
        fontSize: "22px",
        fontFamily: "Poppins",
        color: "#ffffff",
      }
    ).setOrigin(0.5, 0);

    // SLOT
    const slotPlus = this.add.image(230, 300, "slotPlus");
    const slotMinus = this.add.image(560, 300, "slotMinus");

    // ================= GLOBAL DRAG (FIX UTAMA) =================
    this.input.on(
      "drag",
      (_pointer: Phaser.Input.Pointer, obj: any, dragX: number, dragY: number) => {
        obj.x = dragX;
        obj.y = dragY;
      }
    );

    this.input.on(
      "dragend",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject) => {
        this.checkDrop(obj as Phaser.GameObjects.Image, slotPlus, slotMinus);
      }
    );

    // ION
    const ionNa = this.add
      .image(200, 520, "na")
      .setInteractive()
      .setData("ionType", "plus")
      .setData("startX", 200)
      .setData("startY", 520);

    const ionCl = this.add
      .image(600, 520, "cl")
      .setInteractive()
      .setData("ionType", "minus")
      .setData("startX", 600)
      .setData("startY", 520);

    this.input.setDraggable([ionNa, ionCl]);

    // ANIMATION
    this.tweens.add({
      targets: [ionNa, ionCl],
      angle: { from: -10, to: 10 },
      duration: 1500,
      repeat: -1,
      yoyo: true,
      ease: "Sine.easeInOut",
    });
  }

  // ================= CHECK DROP =================
  private checkDrop(
    obj: Phaser.GameObjects.Image,
    slotPlus: Phaser.GameObjects.Image,
    slotMinus: Phaser.GameObjects.Image
  ) {
    const ionType = obj.getData("ionType");

    const isPlusCorrect =
      ionType === "plus" &&
      Phaser.Math.Distance.Between(obj.x, obj.y, slotPlus.x, slotPlus.y) < 80;

    const isMinusCorrect =
      ionType === "minus" &&
      Phaser.Math.Distance.Between(obj.x, obj.y, slotMinus.x, slotMinus.y) < 80;

    if (isPlusCorrect || isMinusCorrect) {
      this.correct(obj);
    } else {
      this.resetPosition(obj);
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

  // ================= CORRECT =================
  private correct(obj: Phaser.GameObjects.Image) {
    this.correctCount++;

    obj.setTint(0x00ff00);
    obj.disableInteractive();

    this.tweens.add({
      targets: obj,
      scale: 1.1,
      duration: 200,
      yoyo: true,
    });

    if (this.correctCount >= 2) {
      this.finishPuzzle();
    }
  }

  // ================= FINISH =================
  private finishPuzzle() {
    this.add.text(220, 550, "Stabilizer Aktif!", {
      fontSize: "20px",
      color: "#ffffff",
    });

    this.time.delayedCall(1200, () => {
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "ion",
        })
      );
    });
  }
}