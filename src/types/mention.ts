export interface MentionInput {
    external_id: string;
    source: string;
    title: string | null;
    content: string;
    url: string;
    author: string | null;
    published_at: string | number | null;
    engagement: string | number;
}

export interface NormalizedMention {
    externalId: string;
    source: string;
    title: string | null;
    content: string;
    url: string;
    author: string | null;
    publishedAt: Date | null;
    engagement: number;
}

export type StatsGroupBy = "source" | "day";
export interface MentionStats{
    label: string;
    count: number;
}

