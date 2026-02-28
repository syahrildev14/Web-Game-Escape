import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// type untuk params
interface VideoParams {
  name: string;
}

// GET video by name
export const getVideo = async (
  req: Request<VideoParams>,
  res: Response
) => {
  try {
    const video = await prisma.video.findUnique({
      where: { name: req.params.name },
    });

    if (!video) {
      return res.status(404).json({ message: "Video tidak ditemukan" });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil video" });
  }
};

// UPDATE / CREATE video
export const updateVideo = async (
  req: Request<VideoParams>,
  res: Response
) => {
  try {
    const updated = await prisma.video.upsert({
      where: { name: req.params.name },
      update: { url: req.body.url },
      create: {
        name: req.params.name,
        url: req.body.url,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("ERROR UPDATE VIDEO:", error);
    res.status(500).json({ message: "Gagal update video" });
  }
};