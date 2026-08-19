CREATE TABLE mentions (
    id BIGSERIAL PRIMARY KEY,
    external_id VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    url TEXT NOT NULL,
    author VARCHAR(255),
    published_at TIMESTAMPTZ,
    engagement INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT mentions_external_id_source_unique
        UNIQUE (external_id, source)
);

CREATE INDEX idx_mentions_source
    ON mentions (source);

CREATE INDEX idx_mentions_published_at
    ON mentions (published_at DESC);

CREATE INDEX idx_mentions_source_published_at
    ON mentions (source, published_at DESC);