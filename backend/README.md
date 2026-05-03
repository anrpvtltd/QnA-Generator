# AI Document Q&A Backend (Industry-Ready)

## Features
- **Session Isolation**: Each user gets a unique `sessionId` for document context.
- **Performance**: Optimized LangChain pipeline with refined chunking.
- **Stability**: Memory management via TTL Cache (auto-clears sessions after 1 hour).
- **Security**: Rate limiting and request validation.

## Setup
1. Fill in `OPENAI_API_KEY` in `.env`.
2. Run `npm install`.
3. Start the server with `npm run dev`.

## API Endpoints
- `POST /upload` — Upload PDF. Returns `sessionId`.
- `POST /ask` — Ask question. Body: `{ sessionId, question }`.

## Limits
- Max file size: 5MB
- Max text extraction: 100k characters
- Rate limit: 100 requests per 15 mins per IP
