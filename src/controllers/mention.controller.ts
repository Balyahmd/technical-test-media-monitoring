import type { Request, Response } from "express";
import type { MentionsInput } from "../types/mention.ts";
import { bulksIngesMentions } from "../services/mention.service.ts";

export const bulkIngest = async (
  req: Request<{}, {}, MentionsInput[]>,
  res: Response,
): Promise<void> => {
  try {
    const insertedCount = await bulksIngesMentions(req.body);

    res.status(201).json({
      message: "Mentions ingested successfully",
      inserted: insertedCount,
    });
  } catch (error) {
    console.error("Bulk ingest failed", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
