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
  private roomCode: string = "GAYA-006";

  constructor() {
    super("GayaAntarmolekulScene");
  }

  init(data: any) {
    this.roomCode = data?.roomCode || "GAYA-006";
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

    this.cameras.main.setBackgroundColor("#1e88e5");

    this.add.text(40, 20, "Ruang Gaya Antarmolekul", {
      fontSize: "26px",
      color: "#ffffff",
    });

    /** ZONE */
    this.createZone(180, 380, "Hydrogen Bond", IntermolecularForce.HYDROGEN);
    this.createZone(420, 380, "Dipole–Dipole", IntermolecularForce.DIPOLE);
    this.createZone(660, 380, "London Force", IntermolecularForce.LONDON);

    /** ================= DRAG GLOBAL (FIX UTAMA) ================= */
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
        this.checkDrop(obj as Phaser.GameObjects.Image);
      }
    );

    /** MOLECULE */
    this.molecules.forEach((m, i) => {
      const obj = this.add
        .image(200 + (i % 3) * 180, 140 + Math.floor(i / 3) * 120, m.textureKey)
        .setScale(0.7)
        .setInteractive();

      obj.setData("key", m.key);
      obj.setData("correctForce", m.correctForce);
      obj.setData("startX", obj.x);
      obj.setData("startY", obj.y);

      this.input.setDraggable(obj);
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
    const zone = this.add.zone(x, y, 200, 90);

    (zone as any).forceType = type;

    this.add.rectangle(x, y, 200, 90, 0xffffff, 0.15).setStrokeStyle(2, 0xffffff);

    this.add.text(x, y, label, {
      fontSize: "14px",
      color: "#ffffff",
    }).setOrigin(0.5);
  }

  /* ============================= */
  private finishPuzzle() {
    this.add.text(400, 520, `KODE AKHIR: ${this.roomCode}`, {
      fontSize: "30px",
      color: "#ffffff",
    }).setOrigin(0.5);

    // FIX: lebih stabil pakai window event (konsisten dengan scene lain)
    window.dispatchEvent(
      new CustomEvent("puzzleCompleted", {
        detail: this.roomCode,
      })
    );
  }
}