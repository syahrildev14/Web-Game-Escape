import Result from "../models/result.model";
import { Request, Response } from "express";


export async function getGlobalRanking(req: Request, res: Response) {
    try {
        const ranking = await Result.aggregate([
            {
                $addFields: {
                    avgScore: { $avg: ["$pretestScore", "$posttestScore"] }
                }
            },
            {
                $group: {
                    _id: "$playerName",
                    totalAvg: { $avg: "$avgScore" }
                }
            },
            { $sort: { totalAvg: -1 } },
            {
                $project: {
                    playerName: "$_id",
                    totalAvg: 1,
                    _id: 0
                }
            }
        ]);


        return res.json(ranking);

    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Gagal memuat ranking" });
    }
}
