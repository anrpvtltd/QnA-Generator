import { generateEmbedding, getAnswer } from '../utils/embedding.js';
import { supabase } from '../config/supabase.js';
import { redisClient } from '../config/redis.js';

export const chatWithDoc = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    // 1. Check Redis Cache
    const cachedAnswer = await redisClient.get(question);
    if (cachedAnswer) {
      console.log("Serving from Cache...");
      return res.json({ answer: cachedAnswer, source: "cache" });
    }

    // 2. Question -> Embedding
    const queryEmbedding = await generateEmbedding(question);

    // 3. Semantic Search in Supabase
    const { data: matches, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_count: 5
    });
    if (error) throw error;

    const context = matches.map(m => `[Source: ${m.metadata?.filename || 'Unknown'}] ${m.content}`).join("\n\n");

    // 4. Get Answer from Gemini
    const answer = await getAnswer(question, context);

    // 5. Persistent History: Save to Supabase
    const { sessionId } = req.body;
    if (sessionId) {
      await supabase.from('chat_history').insert([
        { session_id: sessionId, role: 'user', content: question },
        { session_id: sessionId, role: 'assistant', content: answer }
      ]);
    }

    // 6. Store in Redis (TTL: 1 Hour)
    await redisClient.set(question, answer, { EX: 3600 });

    res.json({ answer, source: "ai" });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
};
