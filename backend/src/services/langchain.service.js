import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { supabase } from './supabase.service.js';

const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

export async function processDocumentAndStore(text, documentId, userId) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 100
  });

  const chunks = await splitter.splitText(text);
  
  // Generate embeddings
  const chunkEmbeddings = await embeddings.embedDocuments(chunks);
  
  const records = chunks.map((chunk, i) => ({
    document_id: documentId,
    user_id: userId,
    chunk_text: chunk,
    embedding: chunkEmbeddings[i]
  }));

  const { error } = await supabase.from('document_chunks').insert(records);
  if (error) throw error;
  
  await supabase.from('documents').update({ status: 'ready' }).eq('id', documentId);
}

export async function getRelevantChunksWithMemory(userId, currentDocumentId, question) {
  const queryEmbedding = await embeddings.embedQuery(question);

  const { data: currentDocChunks, error: err1 } = await supabase.rpc('match_document_chunks', {
    query_embedding: queryEmbedding,
    match_count: 3,
    filter_document_id: currentDocumentId,
    filter_user_id: userId
  });
  if (err1) throw err1;

  const { data: globalChunks, error: err2 } = await supabase.rpc('match_document_chunks', {
    query_embedding: queryEmbedding,
    match_count: 5,
    filter_document_id: null,
    filter_user_id: userId
  });
  if (err2) throw err2;

  const pastDocChunks = globalChunks
    .filter(chunk => chunk.document_id !== currentDocumentId)
    .slice(0, 2);

  const combinedText = [
    "--- CURRENT DOCUMENT CONTEXT ---",
    ...(currentDocChunks || []).map(c => c.chunk_text),
    "--- PAST KNOWLEDGE CONTEXT ---",
    ...(pastDocChunks || []).map(c => c.chunk_text)
  ].join("\n\n");

  return combinedText;
}
