import pdf from 'pdf-parse';
import fs from 'fs';
import { splitIntoChunks } from '../utils/chunking.js';
import { generateEmbedding } from '../utils/embedding.js';
import { supabase } from '../config/supabase.js';
import { performOCR } from '../utils/ocr.js';

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file provided" });

    // 1. Register Document to get UUID id
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({ file_name: req.file.originalname })
      .select()
      .single();

    if (docError) throw docError;
    const documentId = docData.id;

    // 2. Extract Text
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    let extractedText = data.text;

    if (!extractedText || extractedText.trim().length < 100) {
      extractedText = await performOCR(req.file.path);
    }

    const chunks = splitIntoChunks(extractedText);

    // 3. Insert Chunks into 'document_chunks'
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      const { error: chunkError } = await supabase.from('document_chunks').insert({
        document_id: documentId,
        chunk_text: chunks[i],
        embedding: embedding
      });
      if (chunkError) throw chunkError;
    }

    fs.unlinkSync(req.file.path);
    res.json({ success: true, documentId, message: "PDF processed and stored in document_chunks" });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};
