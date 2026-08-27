from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retriever import retrieve_context
from app.concierge.answer_generator import generate_answer


router = APIRouter(
    prefix="/concierge",
    tags=["AI Concierge"]
)


class QuestionRequest(BaseModel):
    question: str


@router.get("/test")
def concierge_test():
    return {
        "message": "AI Concierge API is working!"
    }


@router.post("/ask")
def ask_concierge(request: QuestionRequest):

    result = retrieve_context(request.question)

    if not result["found"]:
        return {
            "question": request.question,
            "answer": (
                "I could not find reliable information about this "
                "in the official Learnathon knowledge base."
            ),
            "source": None,
            "confidence": round(result["score"], 4),
            "status": "not_found"
        }

    return {
        "question": request.question,
        "answer": generate_answer(result["context"]),
        "source": result["source"],
        "confidence": round(result["score"], 4),
        "status": "answered"
    }