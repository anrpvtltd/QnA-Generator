import { supabase } from '../config/supabase.js';

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    const { data, error } = await supabase
      .from('chat_history')
      .select('role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ history: data });
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: error.message });
  }
};
