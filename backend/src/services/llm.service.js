import { OpenAI } from 'langchain/llms/openai';

export async function getAnswerFromLLM(question, contextChunks) {
  const context = contextChunks.join('\n---\n');
  const prompt = `
    Role: Professional AI Assistant
    Task: Answer the Question based ONLY on the provided Context.
    
    Strict Rules:
    1. If the answer is not in the context, reply exactly: "Answer not found in document".
    2. Keep the answer concise (max 3-4 sentences).
    3. Do not use outside knowledge.
    
    Context:
    ${context}
    
    Question: ${question}
    Answer:
  `.trim();

  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0, // Lower temperature for factual consistency
    maxTokens: 300
  });

  const response = await llm.call(prompt);
  return response.trim();
}
