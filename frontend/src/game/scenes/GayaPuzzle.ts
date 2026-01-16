import Phaser from "phaser";

import h2oImg from "../../assets/kovalen/h2.svg";
import nh3Img from "../../assets/kovalen/double.svg";
import co2Img from "../../assets/kovalen/co2.svg";
import hclImg from "../../assets/kovalen/h2.svg";
import ch4Img from "../../assets/kovalen/h2.svg";
import o2Img from "../../assets/kovalen/h2.svg";

/* ==================================================
   INTERMOLECULAR FORCE
================================================== */
export const IntermolecularForce = {
  HYDROGEN: "hydrogen",
  DIPOLE: "dipole",
  LONDON: "london",
} as const;

export type IntermolecularForce =
  (typeof IntermolecularForce)[keyof typeof IntermolecularForce];

/* ==================================================
   MOLECULE TYPE
================================================== */
interface MoleculeData {
  key: string;
  textureKey: string;
  image: string;
  correctForce: IntermolecularForce;
}

/* ==================================================
   SCENE
================================================== */
export default class GayaAntarmolekulScene extends Phaser.Scene {
  private molecules: MoleculeData[] = [
    {
      key: "H2O",
      textureKey: "h2o",
      image: h2oImg,
      correctForce: IntermolecularForce.HYDROGEN,
    },
    {
      key: "NH3",
      textureKey: "nh3",
      image: nh3Img,
      correctForce: IntermolecularForce.HYDROGEN,
    },
    {
      key: "HCl",
      textureKey: "hcl",
      image: hclImg,
      correctForce: IntermolecularForce.DIPOLE,
    },
    {
      key: "CO2",
      textureKey: "co2",
      image: co2Img,
      correctForce: IntermolecularForce.LONDON,
    },
    {
      key: "CH4",
      textureKey: "ch4",
      image: ch4Img,
      correctForce: IntermolecularForce.LONDON,
    },
    {
      key: "O2",
      textureKey: "o2",
      image: o2Img,
      correctForce: IntermolecularForce.LONDON,
    },
  ];

  private placed = new Set<string>();

  constructor() {
    super("GayaAntarmolekulScene");
  }

  /* =============================
     PRELOAD
  ============================= */
  preload() {
    this.molecules.forEach((m) => {
      this.load.image(m.textureKey, m.image);
    });
  }

  create() {
    /* =============================
       BACKGROUND BIRU
    ============================= */
    this.cameras.main.setBackgroundColor("#1e88e5");

    this.add.text(40, 20, "Ruang Gaya Antarmolekul", {
      fontSize: "26px",
      color: "#ffffff",
    });

    /* =============================
       FORCE ZONES
    ============================= */
    this.createForceZone(
      180,
      380,
      "Hydrogen Bond",
      IntermolecularForce.HYDROGEN
    );
    this.createForceZone(420, 380, "Dipole–Dipole", IntermolecularForce.DIPOLE);
    this.createForceZone(660, 380, "London Force", IntermolecularForce.LONDON);

    /* =============================
       MOLECULE IMAGES (2 BARIS)
    ============================= */
    this.molecules.forEach((m, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);

      const molecule = this.add
        .image(200 + col * 180, 140 + row * 120, m.textureKey)
        .setScale(0.7)
        .setDepth(2)
        .setInteractive({ draggable: true });

      molecule.setData("key", m.key);
      molecule.setData("correctForce", m.correctForce);

      this.input.setDraggable(molecule);
    });

    /* =============================
       DRAG
    ============================= */
    this.input.on("drag", (_p, obj: Phaser.GameObjects.Image, x, y) => {
      obj.setPosition(x, y);
    });

    /* =============================
       DROP
    ============================= */
    this.input.on(
      "drop",
      (
        _,
        obj: Phaser.GameObjects.Image,
        zone: Phaser.GameObjects.Zone & { forceType: IntermolecularForce }
      ) => {
        const correct = obj.getData("correctForce") === zone.forceType;

        if (correct) {
          obj.setPosition(zone.x, zone.y);
          obj.disableInteractive();
          obj.setTint(0x88ff88);

          this.placed.add(obj.getData("key"));

          if (this.placed.size === this.molecules.length) {
            this.showFinalCode();
          }
        } else {
          this.tweens.add({
            targets: obj,
            x: obj.x + 10,
            yoyo: true,
            repeat: 3,
            duration: 60,
          });
        }
      }
    );
  }

  /* =============================
     FORCE ZONE
  ============================= */
  private createForceZone(
    x: number,
    y: number,
    label: string,
    type: IntermolecularForce
  ) {
    const zone = this.add
      .zone(x, y, 200, 90)
      .setRectangleDropZone(200, 90) as Phaser.GameObjects.Zone & {
      forceType: IntermolecularForce;
    };

    zone.forceType = type;

    this.add
      .rectangle(x, y, 200, 90, 0xffffff, 0.15)
      .setStrokeStyle(2, 0xffffff);

    this.add
      .text(x, y, label, {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  /* =============================
     FINAL CODE
  ============================= */
  private showFinalCode() {
    const bg = this.add
      .rectangle(400, 250, 320, 140, 0x000000, 0.8)
      .setDepth(10);

    const text = this.add
      .text(400, 250, "KODE AKHIR\n6", {
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(11);

    this.tweens.add({
      targets: [bg, text],
      alpha: { from: 0, to: 1 },
      duration: 500,
    });
  }
}
