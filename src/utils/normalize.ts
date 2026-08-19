import type { MentionsInput } from "../types/mention.ts";

export interface NormalizeMention {
  externalId: string;
  source: string;
  title: string;
  content: string;
  url: string;
  publishedAt: Date | null;
}

export const normalizeSource = (source: string): string => {
  return source.trim();
};

export const normalizeMention = (mentions: MentionsInput): NormalizeMention => {
  return {
    externalId: mentions.external_id.trim(),
    source: normalizeSource(mentions.source),
    title: mentions.title.trim(),
    content: mentions.title.trim(),
    url: mentions.url.trim(),
    publishedAt: mentions.published_at 
        ? new Date(mentions.published_at) 
        : null,
  };
};
