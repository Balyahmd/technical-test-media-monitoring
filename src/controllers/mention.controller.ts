import type { Request, Response } from "express";
import type { MentionInput } from "../types/mention.ts";
import { bulkIngestMentions } from "../services/mention.service.ts";
import { searchMentions } from "../services/mention.service.ts";
import type { MentionSearchQuery } from "../types/pagination.ts";

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

export const search = async (
  req: Request<{}, {}, {}, MentionSearchQuery>,
  res: Response,
): Promise<void> => {
  try {
    const result = await searchMentions(req.query);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    res.status(200).json({
      success: true,
      message: "Metion retrived successfully",
      data: result.data,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPage: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Search mentiond failed", error);

    res.status(500).json({
      seccess: false,
      message: "Internal server error",
    });
  }
};
