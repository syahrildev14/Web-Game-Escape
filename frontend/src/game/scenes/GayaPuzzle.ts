import Phaser from "phaser";

import h2oImg from "../../assets/kovalen/h2.svg";
import nh3Img from "../../assets/kovalen/double.svg";
import co2Img from "../../assets/kovalen/co2.svg";
import hclImg from "../../assets/kovalen/h2.svg";
import ch4Img from "../../assets/kovalen/h2.svg";
import o2Img from "../../assets/kovalen/h2.svg";

/* ============================= */
export const IntermolecularForce = {
  HYDROGEN: "hydrogen",
  DIPOLE: "dipole",
  LONDON: "london",
} as const;

export type IntermolecularForce =
  (typeof IntermolecularForce)[keyof typeof IntermolecularForce];

/* ============================= */
interface MoleculeData {
  key: string;
  textureKey: string;
  image: string;
  correctForce: IntermolecularForce;
}

/* ============================= */
export default class GayaAntarmolekulScene extends Phaser.Scene {
  private placed = new Set<string>();

  constructor() {
    super("GayaAntarmolekulScene");
  }


  private molecules: MoleculeData[] = [
    { key: "H2O", textureKey: "h2o", image: h2oImg, correctForce: IntermolecularForce.HYDROGEN },
    { key: "NH3", textureKey: "nh3", image: nh3Img, correctForce: IntermolecularForce.HYDROGEN },
    { key: "HCl", textureKey: "hcl", image: hclImg, correctForce: IntermolecularForce.DIPOLE },
    { key: "CO2", textureKey: "co2", image: co2Img, correctForce: IntermolecularForce.LONDON },
    { key: "CH4", textureKey: "ch4", image: ch4Img, correctForce: IntermolecularForce.LONDON },
    { key: "O2", textureKey: "o2", image: o2Img, correctForce: IntermolecularForce.LONDON },
  ];

  /* ============================= */
  preload() {
    this.molecules.forEach((m) => {
      this.load.image(m.textureKey, m.image);
    });
  }

  /* ============================= */
  create() {
    this.placed.clear();

    // ================= BACKGROUND =================
    this.cameras.main.setBackgroundColor("#0f172a");

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
      .text(400, 40, "Puzzle Gaya Antarmolekul", {
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
        "Tugas: Kelompokkan molekul berdasarkan gaya antarmolekul dominannya.",
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
        "1. Seret molekul ke kategori yang sesuai.\n2. Cocokkan dengan Hydrogen Bond, Dipole–Dipole, atau London Force.\n3. Semua molekul harus berada pada kategori yang benar.",
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
        "Gaya antarmolekul memengaruhi titik didih, titik leleh, dan sifat fisik suatu zat.",
        {
          fontSize: "16px",
          color: "#93c5fd",
          align: "center",
          fontFamily: "Poppins",
        }
      )
      .setOrigin(0.5);

    // ================= ZONE =================
    this.createZone(
      180,
      360,
      "Hydrogen Bond",
      IntermolecularForce.HYDROGEN
    );

    this.createZone(
      400,
      360,
      "Dipole–Dipole",
      IntermolecularForce.DIPOLE
    );

    this.createZone(
      620,
      360,
      "London Force",
      IntermolecularForce.LONDON
    );

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
        this.checkDrop(obj as Phaser.GameObjects.Image);
      }
    );

    // ================= MOLEKUL =================
    this.molecules.forEach((m, i) => {
      const obj = this.add
        .image(
          170 + (i % 3) * 220,
          500 + Math.floor(i / 3) * 70,
          m.textureKey
        )
        .setScale(0.65)
        .setInteractive();

      obj.setData("key", m.key);
      obj.setData("correctForce", m.correctForce);

      obj.setData("startX", obj.x);
      obj.setData("startY", obj.y);

      this.input.setDraggable(obj);

      this.tweens.add({
        targets: obj,
        angle: { from: -5, to: 5 },
        duration: 1800,
        repeat: -1,
        yoyo: true,
        ease: "Sine.easeInOut",
      });

      this.add
        .text(obj.x, obj.y + 40, m.key, {
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: "Poppins",
        })
        .setOrigin(0.5);
    });
  }

  /* ============================= */
  private checkDrop(obj: Phaser.GameObjects.Image) {
    const force = obj.getData("correctForce") as IntermolecularForce;
    const key = obj.getData("key") as string;

    const zones = this.children
      .getAll()
      .filter((z: any) => z.forceType) as Phaser.GameObjects.GameObject[];

    let matched = false;

    zones.forEach((zone: any) => {
      const dist = Phaser.Math.Distance.Between(obj.x, obj.y, zone.x, zone.y);

      if (dist < 80 && zone.forceType === force) {
        obj.setPosition(zone.x, zone.y);
        obj.disableInteractive();
        obj.setTint(0x88ff88);

        this.placed.add(key);
        matched = true;
      }
    });

    if (!matched) {
      this.tweens.add({
        targets: obj,
        x: obj.getData("startX"),
        y: obj.getData("startY"),
        duration: 300,
        ease: "Back.easeOut",
      });
    }

    if (this.placed.size === this.molecules.length) {
      this.finishPuzzle();
    }
  }

  /* ============================= */
  private createZone(
    x: number,
    y: number,
    label: string,
    type: IntermolecularForce
  ) {
    const zone = this.add.zone(
      x,
      y,
      190,
      100
    );

    (zone as any).forceType = type;

    this.add
      .rectangle(
        x,
        y,
        190,
        100,
        0xffffff,
        0.12
      )
      .setStrokeStyle(2, 0x4ade80);

    this.add
      .text(
        x,
        y,
        label,
        {
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
          align: "center",
          fontFamily: "Poppins",
        }
      )
      .setOrigin(0.5);

    return zone;
  }

  /* ============================= */
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
      .text(400, 560, "✓ Struktur Gaya Lengkap", {
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        fontFamily: "Poppins",
      })
      .setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      window.dispatchEvent(
        new CustomEvent("puzzleCompleted", {
          detail: "gaya",
        })
      );
    });
  }
}