# 🚀 ANR PVT LTD - AI QnA Generator (Full-Stack)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

A premium, production-ready AI Document Q&A application built with modern RAG (Retrieval-Augmented Generation) architecture, now powered by **Google Gemini API** for ultra-fast and free processing.

[Live Demo](#) | [Documentation](#) | [Report Bug](#)

---

## 📋 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🎯 About
**AI QnA Generator** is a state-of-the-art solution for interacting with large PDF documents. Using Google Gemini's advanced LLMs and vector embeddings, it allows users to extract precise information from their documents without manual reading.

---

## ✨ Features
- 🎨 **Premium UI:** Sleek dark theme with glassmorphism.
- ⚡ **Gemini Powered:** Fast token-by-token streaming responses.
- ⚙️ **Vector Search:** High-performance semantic search using Supabase `pgvector` (3072 dims).
- ⏱️ **Redis Caching:** Instant responses for repeated questions.
- 🔒 **Secure:** Session isolation and rate limiting.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS**

### Backend
| Technology | Model/Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | 18+ | Runtime |
| **Gemini AI** | `gemini-1.5-flash` | LLM for Chat |
| **Gemini Embed** | `gemini-embedding-001` | 3072-dim Embeddings |
| **Supabase** | PostgreSQL + pgvector | Persistent Storage |
| **Redis** | Upstash | QA Caching |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+
- [Google AI Studio API Key](https://aistudio.google.com/app/apikey) (Free)
- Supabase Project

### 2. Database Setup (CRITICAL)
Gemini uses **3072** dimensions. Run this SQL in your Supabase Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Delete old table if exists
DROP TABLE IF EXISTS documents;

-- Create new table with 3072 dimensions
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(3072)
);

-- Match function for semantic search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(3072),
  match_count int DEFAULT 5
) RETURNS TABLE (
  id bigint,
  content text,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    id,
    content,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 3. Environment Variables
Create a `.env` in the `backend` folder:
```env
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
REDIS_HOST=your_host
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

---

## 👥 Team
Built with ❤️ by the **ANR PVT LTD Development Team**

GitHub: [@anrpvtltd](https://github.com/anrpvtltd)

⭐ Star this repo if you find it helpful!
