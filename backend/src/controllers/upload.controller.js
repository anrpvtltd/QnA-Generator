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
    
    // ✅ SUCCESS LOG
    console.log("DB Insert Success (Document):", docData);
    const documentId = docData.id;

    // 2. Extract Text
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    let extractedText = data.text;

    if (!extractedText || extractedText.trim().length < 100) {
      console.log("Standard extraction failed. Triggering OCR...");
      extractedText = await performOCR(req.file.path);
    }

    const chunks = splitIntoChunks(extractedText);

    // 3. Insert Chunks into 'document_chunks'
    console.log(`Starting chunk insertion for Document ID: ${documentId}`);
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      const { data: chunkData, error: chunkError } = await supabase.from('document_chunks').insert({
        document_id: documentId,
        chunk_text: chunks[i],
        embedding: embedding
      }).select();
      
      if (chunkError) throw chunkError;
      // ✅ LOG HAR CHUNK KE LIYE
      console.log(`Chunk ${i+1}/${chunks.length} Inserted:`, chunkData[0].id);
    }

    fs.unlinkSync(req.file.path);
    
    // ✅ ENHANCED RESPONSE
    res.json({ 
      success: true, 
      message: "PDF uploaded, processed, and saved to DB successfully", 
      document: {
        id: documentId,
        name: req.file.originalname,
        chunks: chunks.length
      }
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
