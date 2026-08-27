from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.auditor.engine import audit_submission_data


router = APIRouter(
    prefix="/auditor",
    tags=["Submission Auditor"]
)


class SubmissionRequest(BaseModel):
    team_name: str
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    readme: bool = False
    problem_statement: Optional[str] = None
    domain: Optional[str] = None


@router.post("/audit")
def audit_submission(
    request: SubmissionRequest
):
    """
    Submission Auditor API.

    Uses the shared Auditor v2 engine so both:
    - standalone Submission Auditor
    - unified HACKMIND Agent

    produce consistent validation results.
    """

    return audit_submission_data(
        team_name=request.team_name,
        github_url=request.github_url,
        demo_url=request.demo_url,
        readme=request.readme,
        problem_statement=request.problem_statement,
        domain=request.domain,
    )