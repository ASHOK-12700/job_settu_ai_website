import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any

from simple_rag import SimpleRAG
from safety import SafetyGuard
from gemini_client import LLMClient

app = FastAPI(title="VCUBE POLICY GUARD AI HR Assistant")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components with error handling
try:
    rag_engine = SimpleRAG(policy_dir=os.path.join(os.path.dirname(__file__), "hr_policies"))
    print("✓ RAG Engine initialized successfully")
except Exception as e:
    print(f"⚠ Warning: RAG Engine initialization failed: {e}")
    rag_engine = None

safety_guard = SafetyGuard()
print("✓ Safety Guard initialized")

try:
    gemini_client = LLMClient()
    print("✓ Gemini Client initialized successfully")
except Exception as e:
    print(f"⚠ Warning: Gemini Client initialization failed: {e}")
    gemini_client = None

class QueryRequest(BaseModel):
    question: str

class SourceItem(BaseModel):
    title: str
    text_snippet: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceItem]
    refused: bool
    reason: Optional[str]
    redacted: dict

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/hr/query", response_model=QueryResponse)
def query_hr(request: QueryRequest):
    # Check if services are initialized
    if not rag_engine or not gemini_client:
        return QueryResponse(
            answer="The HR Assistant service is currently initializing. Please try again in a moment.",
            sources=[],
            refused=True,
            reason="service_unavailable",
            redacted={}
        )
    
    question = request.question.strip()
    
    # 1. PII Redaction
    clean_question, redaction_summary = safety_guard.redact_pii(question)
    
    # 2. Forbidden Intent Detection
    if safety_guard.is_action_request(clean_question):
        return QueryResponse(
            answer="I can only explain HR policies. I cannot approve or process requests.",
            sources=[],
            refused=True,
            reason="action_request",
            redacted=redaction_summary
        )
    
    # 3. Retrieval
    retrieved_chunks = rag_engine.retrieve(clean_question)
    
    # Check if sufficient data found
    if not retrieved_chunks:
        return QueryResponse(
            answer="This information is not specified in the company policy.",
            sources=[],
            refused=True,
            reason="insufficient_policy_data",
            redacted=redaction_summary
        )
    
    # 4. Generate Answer
    answer = gemini_client.generate_answer(clean_question, retrieved_chunks)
    
    # Check if answer is the specific "not found" phrase from system prompt
    if "not specified in the company policy" in answer:
        return QueryResponse(
            answer=answer,
            sources=[SourceItem(title=c['title'], text_snippet=c['text_snippet']) for c in retrieved_chunks],
            refused=True, # Technically a refusal to answer due to data
            reason="insufficient_policy_data",
            redacted=redaction_summary
        )

    # 5. Success Response
    return QueryResponse(
        answer=answer,
        sources=[SourceItem(title=c['title'], text_snippet=c['text_snippet']) for c in retrieved_chunks],
        refused=False,
        reason=None,
        redacted=redaction_summary
    )

@app.get("/api/hr/policies")
def list_policies():
    if not rag_engine:
        return []
    return list(set([doc['title'] for doc in rag_engine.documents]))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
