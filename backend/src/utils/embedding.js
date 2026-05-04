import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmbedding(text) {
  // Using gemini-embedding-001 (768 dimensions)
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function getAnswer(question, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    You are a helpful assistant. Answer the user's question based strictly on the context provided.
    Every time you use information from a source, you must cite it at the end of the sentence or paragraph using the format: [Source: filename].
    
    Context:
    ${context}
    
    Question:
    ${question}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
