import React from 'react';

export default function Message({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-900'}`}>
        {text}
      </div>
    </div>
  );
}
