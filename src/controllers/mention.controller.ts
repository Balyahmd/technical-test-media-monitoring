import type { Request, Response } from "express";
import type { MentionInput } from "../types/mention.ts";
import { bulkIngestMentions } from "../services/mention.service.ts";

export const bulkIngest = async (
  req: Request<{}, {}, MentionInput[]>,
  res: Response,
): Promise<void> => {
  try {
    const receivedCount = req.body.length;

    const result = await bulkIngestMentions(req.body);

    const duplicateCount = receivedCount - result.insertedCount;

    res.status(200).json({
      success: true,
      message: "Mentions processed successfully",
      data: {
        summary: {
          received: receivedCount,
          inserted: result.insertedCount,
          duplicates: duplicateCount,
        },
        inserted: result.inserted,
      },
    });
  } catch (error) {
    console.error("Bulk ingest failed", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};