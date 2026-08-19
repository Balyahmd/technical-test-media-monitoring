import pool from "../config/database.ts";
import type { MentionsInput } from "../types/mention.ts";
import { normalizeMention} from "../utils/normalize.ts";

export const bulksIngesMentions = async (
    mentions: MentionsInput[],
): Promise<Number> => {
    let insertedCount = 0;

    for(const mention of mentions) {
        const normalizedMention = normalizeMention(mention);

        const result = await pool.query(
            `INSERT INTO mentions (
                external_id,
                source,
                title,
                content,
                url,
                published_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (external_id, source)
             DO NOTHING
             `, [
                normalizedMention.externalId,
                normalizedMention.source,
                normalizedMention.title,
                normalizedMention.content,
                normalizedMention.url,
                normalizedMention.publishedAt
             ]
        );
        insertedCount += result.rowCount ?? 0;
    }

    return insertedCount;
}