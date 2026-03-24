-- apps/api/prisma/sql/pgvector_setup.sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base chunks table
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_file  TEXT NOT NULL,
  chunk_index  INTEGER NOT NULL,
  content      TEXT NOT NULL,
  embedding    vector(1536) NOT NULL,
  content_hash TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE UNIQUE INDEX IF NOT EXISTS knowledge_chunks_hash_idx
  ON knowledge_chunks (source_file, content_hash);

GRANT ALL PRIVILEGES ON TABLE knowledge_chunks TO CURRENT_USER;
