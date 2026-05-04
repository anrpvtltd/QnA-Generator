-- 1. Update documents table to include metadata
ALTER TABLE documents ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 2. Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster retrieval by session
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);

-- 3. Update match_documents function to return metadata
-- (Run this if your current function doesn't return metadata)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(768), -- Change to 3072 if using text-embedding-3-large
  match_count INT DEFAULT 5
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
