import pdf from 'pdf-parse';
import fs from 'fs';
import { splitIntoChunks } from '../utils/chunking.js';
import { generateEmbedding } from '../utils/embedding.js';
import { supabase } from '../config/supabase.js';
import { performOCR } from '../utils/ocr.js';

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file provided" });

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    
    let extractedText = data.text;

    // If text is too short, it's likely a scanned PDF
    if (!extractedText || extractedText.trim().length < 100) {
      console.log("Standard extraction failed. Triggering OCR...");
      extractedText = await performOCR(req.file.path);
    }

    const chunks = splitIntoChunks(extractedText);

    console.log(`Processing ${chunks.length} chunks...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      const { error } = await supabase.from('documents').insert({
        content: chunk,
        embedding: embedding,
        metadata: {
          filename: req.file.originalname,
          chunk_index: i
        }
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
