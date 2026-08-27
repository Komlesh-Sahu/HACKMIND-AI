from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.agent.core import analyze_event_state
from app.agent.orchestrator import route_request


router = APIRouter(
    prefix="/agent",
    tags=["Agent Core"]
)


# ==================================================
# AGENT QUERY
# ==================================================

class AgentQueryRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


@router.post("/query")
def agent_query(request: AgentQueryRequest):
    """
    Unified participant-facing HACKMIND Agent.

    The participant sends one natural-language request
    with optional structured context.

    The Agent decides which tool or knowledge source
    should handle it.
    """

    result = route_request(
        request.message,
        request.context
    )

    return {
        "message": request.message,
        "agent": "HACKMIND",
        "result": result
    }


# ==================================================
# PROACTIVE EVENT ANALYSIS
# ==================================================

class SubmissionState(BaseModel):
    team: str

    missing: List[str] = Field(
        default_factory=list
    )

    invalid: List[str] = Field(
        default_factory=list
    )


class AgentRequest(BaseModel):
    minutes_to_deadline: int
    submissions: List[SubmissionState]


@router.post("/analyze")
def analyze_event(request: AgentRequest):
    """
    Proactively inspect event/submission state
    and generate prioritized alerts.

    Supports both:
    - missing submission requirements
    - invalid submission requirements
    """

    submissions = [
        submission.model_dump()
        for submission in request.submissions
    ]

    alerts = analyze_event_state(
        request.minutes_to_deadline,
        submissions
    )

    return {
        "minutes_to_deadline": request.minutes_to_deadline,
        "alerts": alerts
    }