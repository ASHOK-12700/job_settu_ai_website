# Job Settu HR Assistant Backend

Python FastAPI microservice for the HR Chatbot.

## Setup

1. Install Python 3.9+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running

1. Set your Gemini API Key:
   The project is configured to use a `.env` file. A `.env` file has been created for you in the `backend/` directory with the provided API key.
   
   If you need to change it, simply edit `backend/.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   RAG_EMBED_MODEL=all-MiniLM-L6-v2
   ```
2. Start the server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

## Development
- The app runs on port 8001.
- Policies are loaded from `hr_policies/`.
- If you change policies, restart the server to rebuild the index.

## Testing
`curl -X POST http://localhost:8001/api/hr/query -H "Content-Type: application/json" -d '{"question":"What is the leave policy?"}'`
