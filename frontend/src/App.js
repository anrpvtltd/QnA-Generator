import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';

export default function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar for Upload */}
      <div className="md:w-80 w-full bg-white p-6 border-r border-gray-200 shadow-sm overflow-y-auto">
        <FileUpload setSessionId={setSessionId} currentSessionId={sessionId} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100 relative">
        <Chat sessionId={sessionId} />
      </div>
    </div>
  );
}
