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
    // Gambar
    this.load.image("na", na); // Na+
    this.load.image("cl", cl); // Cl-
    this.load.image("slotPlus", plus); // Kation
    this.load.image("slotMinus", minus); // Anion

    // Background cahaya biru
    this.load.image("bgBlue", bgBlue);
  }

  create(): void {
    /** BACKGROUND */
    this.add.image(400, 300, "bgBlue").setDisplaySize(800, 600).setAlpha(0.6);

    /** TEKS NARASI */
    this.add
      .text(
        400, // x center
        30, // y position
        "“Stabilizer Ion hanya aktif jika kamu memahami transfer elektron!” — Dr. Ion",
        {
          fontSize: "20px",
          color: "#aee7ff",
          fontFamily: "Poppins",
          align: "center",
          wordWrap: { width: 700 },
        }
      )
      .setOrigin(0.5, 0) // agar rata tengah
      .setDepth(10);

    /** TEKS INSTRUKSI */
    this.add
      .text(400, 90, "Tarik ion ke tempat yang benar!", {
        fontSize: "22px",
        fontFamily: "Poppins",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0); // CENTER Text

    /** SLOT */
    const slotPlus = this.add.image(230, 300, "slotPlus");
    const slotMinus = this.add.image(560, 300, "slotMinus");

    /** ION Na+ */
    const ionNa = this.add
      .image(200, 520, "na")
      .setInteractive()
      .setData("ionType", "plus");

    /** ION Cl- */
    const ionCl = this.add
      .image(600, 520, "cl")
      .setInteractive()
      .setData("ionType", "minus");

    /** ROTATION CHAOTIC */
    this.tweens.add({
      targets: [ionNa, ionCl],
      angle: { from: -10, to: 10 },
      duration: 1500,
      repeat: -1,
      yoyo: true,
      ease: "Sine.easeInOut",
    });

    /** ENABLE DRAG */
    this.input.setDraggable(ionNa);
    this.input.setDraggable(ionCl);

    /** DRAGGING EVENT */
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

    /** DROP EVENT */
    this.input.on(
      "dragend",
      (_pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.Image) => {
        const ionType = obj.getData("ionType") as string;

        // KATION (positif)
        if (
          ionType === "plus" &&
          Phaser.Math.Distance.Between(obj.x, obj.y, slotPlus.x, slotPlus.y) <
            80
        ) {
          this.correct(obj);
        }
        // ANION (negatif)
        else if (
          ionType === "minus" &&
          Phaser.Math.Distance.Between(obj.x, obj.y, slotMinus.x, slotMinus.y) <
            80
        ) {
          this.correct(obj);
        }
        // SALAH
        else {
          this.tweens.add({
            targets: obj,
            x: ionType === "plus" ? 200 : 600,
            y: 520,
            duration: 300,
            ease: "Back.easeOut",
          });
        }
      }
    );
  }

  /** JIKA BENAR */
  private correct(obj: Phaser.GameObjects.Image) {
    this.correctCount++;

    obj.setTint(0x00ff00); // efek hijau sukses
    obj.disableInteractive();

    // Snap ke slot
    this.tweens.add({
      targets: obj,
      scale: 1.1,
      duration: 200,
    });

    if (this.correctCount === 2) {
      this.finishPuzzle();
    }
  }

  /** PUZZLE SELESAI */
  private finishPuzzle() {
    this.add
      .text(220, 550, "Stabilizer Aktif! Code :1", {
        fontSize: "20px",
        color: "#ffff",
      })
      .setDepth(20);

    this.time.delayedCall(1500, () => {
      // Bisa panggil callback untuk modal tutup, atau event custom
      this.events.emit("puzzleCompleted", "A");
    });
  }
}
