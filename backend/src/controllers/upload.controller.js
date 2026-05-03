import pdf from 'pdf-parse';
import fs from 'fs';
import { splitIntoChunks } from '../utils/chunking.js';
import { generateEmbedding } from '../utils/embedding.js';
import { supabase } from '../config/supabase.js';

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file provided" });

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const chunks = splitIntoChunks(data.text);

    console.log(`Processing ${chunks.length} chunks...`);

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      const { error } = await supabase.from('documents').insert({
        content: chunk,
        embedding: embedding
      });
      if (error) throw error;
    }

    fs.unlinkSync(req.file.path); // Clean up temp file
    res.json({ success: true, message: "PDF processed and stored successfully" });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};
