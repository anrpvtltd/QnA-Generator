import { documentQueue } from '../services/queue.service.js';
import { supabase } from '../services/supabase.service.js';
import fs from 'fs';

export async function uploadController(req, res, next) {
  try {
    const { userId = '00000000-0000-0000-0000-000000000000' } = req.body; 
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `${userId}-${Date.now()}.pdf`;
    
    // In actual production, ensure bucket exists
    const { data: storageData, error: storageError } = await supabase
      .storage.from('documents')
      .upload(fileName, fileBuffer, { contentType: 'application/pdf' });
      
    if (storageError) throw storageError;

    const fileUrl = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl;

    const { data: docRecord, error: dbError } = await supabase
      .from('documents')
      .insert({ user_id: userId, file_url: fileUrl, file_name: req.file.originalname, status: 'processing' })
      .select()
      .single();
      
    if (dbError) throw dbError;

    await documentQueue.add('process-pdf', {
      filePath: req.file.path,
      documentId: docRecord.id,
      userId: userId
    });

    res.json({ 
      documentId: docRecord.id, 
      status: 'processing',
      message: 'Processing started in the background.' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
