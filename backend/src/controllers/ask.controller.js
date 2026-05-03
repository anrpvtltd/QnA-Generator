import { getRelevantChunksWithMemory } from '../services/langchain.service.js';
import { supabase } from '../services/supabase.service.js';
import { ChatOpenAI } from '@langchain/openai';

const chatModel = new ChatOpenAI({ 
  openAIApiKey: process.env.OPENAI_API_KEY, 
  streaming: true,
  modelName: 'gpt-4o-mini' 
});

export async function askController(req, res, next) {
  try {
    const { userId = '00000000-0000-0000-0000-000000000000', documentId, question } = req.body;

    if (!documentId || !question) {
       return res.status(400).json({ error: 'documentId and question are required' });
    }

    const contextText = await getRelevantChunksWithMemory(userId, documentId, question);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const prompt = `You are a helpful AI assistant. Answer the user's question based strictly on the provided context.\n\nContext:\n${contextText}\n\nQuestion: ${question}`;
    
    let fullAnswer = "";

    await chatModel.invoke(prompt, {
      callbacks: [
        {
          handleLLMNewToken(token) {
            fullAnswer += token;
            res.write(`data: ${JSON.stringify({ token })}\n\n`);
          },
        },
      ],
    });

    res.write('data: [DONE]\n\n');
    res.end();

    await supabase.from('chat_history').insert({
      user_id: userId,
      document_id: documentId,
      question: question,
      answer: fullAnswer
    });

  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}
