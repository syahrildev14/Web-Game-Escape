import Phaser from "phaser";
import plus from "../assets/ion/ion+.svg";
import minus from "../assets/ion/ion-.svg";
import na from "../assets/ion/na+.svg";
import cl from "../assets/ion/cl-.svg";
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
    this.add
      .image(400, 300, "bgBlue")
      .setDisplaySize(800, 600)
      .setAlpha(0.6);

    // NARASI
    this.add
      .text(
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
      )
      .setOrigin(0.5, 0)
      .setDepth(10);

    // INSTRUKSI
    this.add
      .text(400, 90, "Tarik ion ke tempat yang benar!", {
        fontSize: "22px",
        fontFamily: "Poppins",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0);

    // SLOT
    const slotPlus = this.add.image(230, 300, "slotPlus");
    const slotMinus = this.add.image(560, 300, "slotMinus");

    // ION
    const ionNa = this.add
      .image(200, 520, "na")
      .setInteractive()
      .setData("ionType", "plus");

    const ionCl = this.add
      .image(600, 520, "cl")
      .setInteractive()
      .setData("ionType", "minus");

    // ANIMASI
    this.tweens.add({
      targets: [ionNa, ionCl],
      angle: { from: -10, to: 10 },
      duration: 1500,
      repeat: -1,
      yoyo: true,
      ease: "Sine.easeInOut",
    });

    // DRAG
    this.input.setDraggable([ionNa, ionCl]);

    this.input.on("drag", (_p, obj, x, y) => {
      obj.x = x;
      obj.y = y;
    });

    // DROP CHECK
    this.input.on("dragend", (_p, obj: any) => {
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
    });
  }

  // ❌ SALAH POSISI
  private resetPosition(obj: any) {
    const type = obj.getData("ionType");

    this.tweens.add({
      targets: obj,
      x: type === "plus" ? 200 : 600,
      y: 520,
      duration: 300,
      ease: "Back.easeOut",
    });
  }

  // ✅ BENAR
  private correct(obj: any) {
    this.correctCount++;

    obj.setTint(0x00ff00);
    obj.disableInteractive();

    this.tweens.add({
      targets: obj,
      scale: 1.1,
      duration: 200,
    });

    if (this.correctCount === 2) {
      this.finishPuzzle();
    }
  }

  // 🎯 SELESAI PUZZLE
  private finishPuzzle() {
    this.add
      .text(220, 550, "Stabilizer Aktif!", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setDepth(20);

    this.time.delayedCall(1200, () => {
      // 🔥 WAJIB: trigger ke React wrapper
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "A", // nanti bisa dari backend / admin
        })
      );
    });
  }
}