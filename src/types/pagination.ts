export type MentionsSearchQuery  = {
    q?: string;
    source?: string;
    from ?:string;
    to?:string;
    page?:string;
    limit?:string
};

export type Mention = {
    id: number;
    externalId: string;
    source: string;
    title: string;
    content: string;
    url: string;
    author: string | null;
    publisheAt: Date | null;
    engagement: number;
}