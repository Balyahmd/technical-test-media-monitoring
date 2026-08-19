import pool from "../config/database.ts";
import type {
  MentionInput,
  StatsGroupBy,
  MentionStats,
} from "../types/mention.ts";
import type { Mention, MentionSearchQuery } from "../types/pagination.ts";
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

export type MentionSearchResult = {
  data: Mention[];
  total: number;
};

export const searchMentions = async (
  query: MentionSearchQuery,
): Promise<MentionSearchResult> => {
  const search = query.q?.trim() || null;
  const source = query.source?.trim() || null;
  const from = query.from || null;
  const to = query.to || null;

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const result = await pool.query<Mention>(
    `
    SELECT
      id,
      external_id AS "externalId",
      source,
      title,
      content,
      url,
      author,
      published_at AS "publishedAt",
      engagement
    FROM mentions
    WHERE
      (
        $1::text IS NULL
        OR title ILIKE '%' || $1 || '%'
        OR content ILIKE '%' || $1 || '%'
      )
      AND ($2::text IS NULL OR source = $2)
      AND ($3::timestamptz IS NULL OR published_at >= $3)
      AND ($4::timestamptz IS NULL OR published_at <= $4)
    ORDER BY published_at DESC NULLS LAST
    LIMIT $5
    OFFSET $6;
    `,
    [search, source, from, to, limit, offset],
  );

  const countResult = await pool.query<{ count: string }>(
    `
    SELECT COUNT(*)::text AS count
    FROM mentions
    WHERE
      (
        $1::text IS NULL
        OR title ILIKE '%' || $1 || '%'
        OR content ILIKE '%' || $1 || '%'
      )
      AND ($2::text IS NULL OR source = $2)
      AND ($3::timestamptz IS NULL OR published_at >= $3)
      AND ($4::timestamptz IS NULL OR published_at <= $4);
    `,
    [search, source, from, to],
  );

  return {
    data: result.rows,
    total: Number(countResult.rows[0].count),
  };
};

export const getMentionStats = async (
  groupBy: StatsGroupBy,
): Promise<MentionStats[]> => {
  if (groupBy === "source") {
    const result = await pool.query<MentionStats>(
      `
      SELECT
        source AS label,
        COUNT(*)::int AS count
      FROM mentions
      GROUP BY source
      ORDER BY count DESC
      `,
    );

    return result.rows;
  }

  const result = await pool.query<MentionStats>(
    `
    SELECT
      DATE(published_at)::text AS label,
      COUNT(*)::int AS count
    FROM mentions
    GROUP BY DATE(published_at)
    ORDER BY DATE(published_at)
    `,
  );

  return result.rows;
};
