import type { MentionInput, NormalizedMention } from "../types/mention.ts";
import { normalizePublishedAt } from "./date.ts";

const SOURCE_MAP: Record<string, string> = {
    "the star": "the_star",
    thestar: "the_star",
    "new straits times": "new_straits_times",
    nst: "new_straits_times",
    twitter: "twitter",
    facebook: "facebook",
    instagram: "instagram",
    malaysiakini: "malaysiakini",
};

export const normalizeSource = (source: string): string => {
    const normalizedSource = source.trim().toLowerCase();

    return SOURCE_MAP[normalizedSource] ?? normalizedSource;
};

export const normalizeTitle = (
    title: string | null,
): string | null => {
    if (title === null) {
        return null;
    }
    const normalizedTitle = title.trim();
    return normalizedTitle.length > 0
        ? normalizedTitle
        : null;
};

export const stripHtml = (content: string): string => {
    return content
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&quot;/gi, '"')
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, " ")
        .trim();
};

export const normalizeAuthor = (
    author: string | null,
): string | null => {
    if (author === null) {
        return null;
    }
    const normalizedAuthor = author.trim();
    return normalizedAuthor.length > 0
        ? normalizedAuthor
        : null;
};

export const normalizeEngagement = (
    engagement: string | number,
): number => {
    if (typeof engagement === "number") {
        return engagement;
    }
    const normalizedEngagement = engagement
        .replace(/,/g, "")
        .trim();

    const result = Number(normalizedEngagement);
    if (!Number.isFinite(result)) {
        throw new Error("Invalid engagement value");
    }

    return result;
};


export const normalizeMention = (
    mention: MentionInput,
): NormalizedMention => {
    return {
        externalId: mention.external_id.trim(),
        source: normalizeSource(
            mention.source,
        ),
        title: normalizeTitle(
            mention.title,
        ),
        content: stripHtml(
            mention.content,
        ),

        url: mention.url.trim(),

        author: normalizeAuthor(
            mention.author,
        ),
        publishedAt: normalizePublishedAt(
            mention.published_at,
        ),
        engagement: normalizeEngagement(
            mention.engagement,
        ),
    };
};