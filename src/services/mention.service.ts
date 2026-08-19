import pool from "../config/database.ts";
import type { MentionInput } from "../types/mention.ts";
import { normalizeMention } from "../utils/normalize.ts";

export type BulkIngestResult = {
  inserted: MentionInput[];
  insertedCount: number;
};

export const bulkIngestMentions = async (
  mentions: MentionInput[],
): Promise<BulkIngestResult> => {
  const inserted: MentionInput[] = [];

  for (const mention of mentions) {
    const normalizedMention = normalizeMention(mention);

    const result = await pool.query<{
      id: number;
    }>(
      `
      INSERT INTO mentions (
        external_id,
        source,
        title,
        content,
        url,
        author,
        published_at,
        engagement
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (external_id, source)
      DO NOTHING
      RETURNING id;
      `,
      [
        normalizedMention.externalId,
        normalizedMention.source,
        normalizedMention.title,
        normalizedMention.content,
        normalizedMention.url,
        normalizedMention.author,
        normalizedMention.publishedAt,
        normalizedMention.engagement,
      ],
    );

    if (result.rows.length > 0) {
      inserted.push(mention);
    }
  }

  return {
    inserted,
    insertedCount: inserted.length,
  };
};