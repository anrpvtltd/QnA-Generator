# 🚀 QA-AI (AI Document Q&A System)

A production-ready, full-stack AI Document Question & Answering web application. This platform allows users to upload PDF documents and have intelligent, context-aware conversations with them. It guarantees that answers are grounded **purely in the uploaded document** (Zero Hallucination), while maintaining a persistent memory of past documents.

---

## 🎯 What is this project and who is it for? (Use Cases)

**What it does:** 
It extracts text from your PDF, chunks it, converts it into mathematical vectors using OpenAI, and stores it in a scalable Supabase (pgvector) database. When you ask a question, it searches the database for the most relevant context and streams an accurate AI-generated response back to you.

**Who can use it?**
- **Students & Researchers**: Quickly extract summaries and find precise answers from massive research papers or textbooks.
- **Lawyers & Legal Teams**: Query contracts, case files, and legal documents without reading hundreds of pages.
- **Corporate Employees**: Chat with HR policies, financial reports, or technical manuals.
- **Developers**: A perfect starter template for building a scalable B2B SaaS around Retrieval-Augmented Generation (RAG).

---

## 🛠️ Tech Stack & Features

**Frontend:**
- React.js (Vite) + Tailwind CSS
- Real-time LLM streaming responses
- Interactive ChatGPT-like UI

**Backend:**
- Node.js + Express
- LangChain + OpenAI API (GPT-4o-mini & embeddings)
- Supabase (PostgreSQL + `pgvector`) for persistent Vector Search & Chat History
- BullMQ + Upstash Redis for asynchronous background processing (Non-blocking PDF processing)

**Core Features:**
- **Zero Hallucination AI:** Strictly answers from the document context.
- **Knowledge Memory:** Remembers past documents of the user for cross-document context.
- **Session Isolation:** Complete privacy and data isolation between different users.
- **Rate Limiting & Validation:** Secure against API abuse and bad payloads.

---

## 💻 How to Run Locally

### 1. Prerequisites
- Node.js installed (v18+)
- A free Supabase account
- A free Upstash Redis account
- An OpenAI API Key

### 2. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   REDIS_HOST=your_upstash_redis_url
   REDIS_PORT=6379
   REDIS_PASSWORD=your_upstash_redis_password
   ```
3. Run the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```
2. Run the frontend development server:
   ```bash
   npm run dev
   ```
3. Your application should now be running at `http://localhost:3000` (or `3001`).

---

## 🐙 How to Push to GitHub

To save your code and track your changes online, follow these steps:

1. **Initialize Git:** (If you haven't already)
   Open your terminal in the root folder (`qa-ai`) and run:
   ```bash
   git init
   ```
2. **Add everything:**
   ```bash
   git add .
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "Initial commit: Production ready AI Doc Q&A"
   ```
4. **Create a repo on GitHub:** 
   Go to [github.com/new](https://github.com/new) and create an empty repository.
5. **Link and Push:** 
   Copy the commands GitHub gives you at the end, which will look like this:
   ```bash
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

*(Note: Ensure your `.env` files and `node_modules` are added to `.gitignore` so your secret keys never leak on GitHub!)*

---

## 🌍 How to Deploy (Go Live)

This project is built to be deployed on affordable/free tiers of modern cloud providers.

### Step 1: Deploy Backend (Render or Railway)
1. Go to [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Select the `backend` folder as the **Root Directory**.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all the environment variables from your `.env` file into the Render Environment settings.
7. Click **Deploy**. Copy the backend URL once it's live.

### Step 2: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Connect your GitHub repository.
3. Select the `frontend` folder as the Root Directory.
4. Ensure the Framework Preset is set to **Vite**.
5. Add an environment variable like `VITE_API_URL` and set it to the Render Backend URL you just got. *(Make sure your frontend API calls use this variable instead of localhost)*.
6. Click **Deploy**.

**Congratulations! Your AI SaaS is now live for the world to use! 🎉**
