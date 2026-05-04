import { supabase } from '../config/supabase.js';

export const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;

    let query = supabase
      .from('chat_history')
      .select('question, answer, created_at')
      .order('created_at', { ascending: true });

    if (documentId && documentId !== 'null') {
      query = query.eq('document_id', documentId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Convert one row (question+answer) into two messages for the frontend
    const formattedHistory = [];
    data.forEach(item => {
      formattedHistory.push({ sender: 'user', text: item.question });
      formattedHistory.push({ sender: 'ai', text: item.answer });
    });

    res.json({ history: formattedHistory });
  } catch (error) {
    console.error("History Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
};
