import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';

export default function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      fetchHistory();
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const fetchHistory = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await axios.get(`${API_URL}/api/history/${sessionId}`);
      const history = res.data.history.map(m => ({
        sender: m.role === 'user' ? 'user' : 'ai',
        text: m.content
      }));
      setMessages(history);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    
    const userMsg = { sender: 'user', text: input.trim() };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        sessionId,
        question: userMsg.text
      });
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: res.data.answer }
      ]);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Could not get answer. Please check if the session is still active.';
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', text: `Error: ${errorMsg}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Chat with Document</h2>
        {sessionId && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded uppercase tracking-wider font-semibold">Active Session</span>}
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-xl shadow-inner border border-gray-100 p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
            Ask a question to start the conversation...
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <Message key={idx} sender={msg.sender} text={msg.text} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm animate-pulse flex items-center">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <textarea
          className="flex-1 border-none focus:ring-0 p-2 text-sm resize-none"
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!sessionId || loading}
          placeholder={sessionId ? "Type your question here..." : "Please upload a document first"}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || !sessionId}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
