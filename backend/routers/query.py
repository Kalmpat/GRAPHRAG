from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import deps

router = APIRouter(prefix="/api/v1", tags=["GraphRAG Query"])

class ChatMessage(BaseModel):
    role: str
    content: str

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5
    session_id: Optional[str] = None
    chat_history: Optional[List[ChatMessage]] = []


class QueryResponse(BaseModel):
    answer: str

@router.post("/query", response_model=QueryResponse)
def ask_rag(payload: QueryRequest):
    if not deps.rag_service:
        raise HTTPException(status_code=500, detail="RAG service not available")
    try:
        history_dicts = (
            [msg.model_dump() for msg in payload.chat_history]
            if payload.chat_history
            else []
        )
        answer = deps.rag_service.query(
           query_text=payload.query,
            top_k=payload.top_k,
            chat_history=history_dicts,
        )
        return QueryResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))