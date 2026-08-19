CREATE TABLE mentions (
    id BIGSERIAL PRIMARY KEY,
    external_id VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT mentions_external_id_source_unique
        UNIQUE (external_id, source)
);

CREATE INDEX idx_mentions_source
    ON mentions (source);

CREATE INDEX idx_mentions_published_at
    ON mentions (published_at);

CREATE INDEX idx_mentions_source_published_at
    ON mentions (source, published_at DESC);