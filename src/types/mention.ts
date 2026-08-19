export interface MentionsInput {
    external_id: string;
    source: string;
    title: string;
    content: string;
    url:string;
    published_at: Date | null
}

export type BulksMentionRequest = MentionsInput[];