import type { NextFunction, Request, Response } from "express";
import type { MentionsInput } from "../types/mention.ts";

const isValidMentions = (value: MentionsInput): boolean => {
  return (
    value.external_id.trim().length > 0 &&
    value.source.trim().length > 0 &&
    value.title.trim().length > 0 &&
    value.content.trim().length > 0 &&
    value.url.trim().length > 0
  );
};

export const validateBulkMention = (
  req: Request<{}, {}, MentionsInput[]>,
  res: Response,
  next: NextFunction,
): void => {
  const mentions = req.body;

  if (!Array.isArray(mentions)) {
    res.status(400).json({
      message: "Request body must be an array",
    });
    return;
  }

  const hasInvalidMentions = mentions.some(
    (mentions: MentionsInput) => !isValidMentions(mentions),
  );

  if (hasInvalidMentions) {
    res.status(400).json({
      message: "Invalid mention data",
    });

    return;
  }
  next();
};
