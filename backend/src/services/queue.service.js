import { Queue, Worker } from 'bullmq';
import { extractTextFromPDF } from './pdf.service.js';
import { processDocumentAndStore } from './langchain.service.js';
import { supabase } from './supabase.service.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {}
};

export const documentQueue = new Queue('document-processing', { connection });

const worker = new Worker('document-processing', async (job) => {
  const { filePath, documentId, userId } = job.data;
  
  try {
    const text = await extractTextFromPDF(filePath);
    await processDocumentAndStore(text, documentId, userId);
    console.log(`Document ${documentId} processed successfully.`);
  } catch (error) {
    console.error(`Failed to process document ${documentId}:`, error);
    await supabase.from('documents').update({ status: 'failed' }).eq('id', documentId);
  }
}, { connection });
