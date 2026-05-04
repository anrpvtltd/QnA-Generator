import { generateEmbedding, getAnswer } from '../utils/embedding.js';
import { supabase } from '../config/supabase.js';

export const chatWithDoc = async (req, res) => {
  try {
    const { question, documentId } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const queryEmbedding = await generateEmbedding(question);

    // 1. Semantic Search using the new RPC function
    const { data: matches, error } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_count: 5
    });
    if (error) throw error;

    // 2. Prepare Context with Source Info
    const context = matches.map(m => `[Source: ${m.file_name}] ${m.chunk_text}`).join("\n\n");

    // 3. Get Answer from Gemini
    const answer = await getAnswer(question, context);

    // 4. Save to 'chat_history' table (Your schema: question, answer, document_id)
    const { error: historyError } = await supabase.from('chat_history').insert({
      question: question,
      answer: answer,
      document_id: documentId || null
    });
    if (historyError) console.error("History Save Error:", historyError);

    res.json({ answer, source: "ai" });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
};
