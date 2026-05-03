import React, { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ setSessionId, currentSessionId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setSessionId(res.data.sessionId);
      setSuccess('Document processed! You can now ask questions.');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Knowledge Base</h2>
        <p className="text-xs text-gray-500 mb-4">Upload a PDF to start chatting</p>
      </div>

      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}>
        <input 
          type="file" 
          id="file-upload"
          accept="application/pdf" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="text-sm text-gray-600">
            {file ? file.name : 'Click to select PDF'}
          </div>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? 'Processing Document...' : 'Process Document'}
      </button>

      {error && <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
      {success && <div className="p-3 text-xs text-green-600 bg-green-50 rounded-lg border border-green-100">{success}</div>}
      
      {currentSessionId && (
        <div className="pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Active Session Ready
          </div>
        </div>
      )}
    </div>
  );
}
