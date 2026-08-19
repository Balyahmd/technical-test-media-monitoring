import type { NextFunction, Request, Response } from "express";
import type { MentionInput } from "../types/mention.ts";

const isValidMentions = (value: MentionInput): boolean => {
  return (
    value.external_id.trim().length > 0 &&
    value.source.trim().length > 0 &&
    value.content.trim().length > 0 &&
    value.url.trim().length > 0
  );
};

export const validateBulkMention = (
  req: Request<{}, {}, MentionInput[]>,
  res: Response,
  next: NextFunction,
): void => {
  const mentions = req.body;

  const hasInvalidMentions = mentions.some(
    (mentions: MentionInput) => !isValidMentions(mentions),
  );

  if (hasInvalidMentions) {
    res.status(400).json({
      message: "Invalid mention data",
    });

    return;
  }
  next();
};
