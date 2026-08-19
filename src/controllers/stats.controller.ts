import type { Request, Response } from "express";
import { getMentionStats } from "../services/mention.service.ts";

export const stats = async (
  req: Request<{}, {}, {}, { group_by?: string }>,
  res: Response,
): Promise<void> => {
  try {
    const groupBy = req.query.group_by;

    if (groupBy !== "source" && groupBy !== "day") {
      res.status(400).json({
        success: false,
        message: "group_by must be either source or day",
      });
      return;
    }

    const result = await getMentionStats(groupBy);

    res.status(200).json({
      success: true,
      message: "Mention stats retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get mention stats failed", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
