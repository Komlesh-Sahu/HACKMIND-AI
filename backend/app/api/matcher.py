from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List

from app.matcher.engine import calculate_match


router = APIRouter(
    prefix="/matcher",
    tags=["Team Matcher"]
)


class Participant(BaseModel):
    name: str
    skills: List[str]
    domain: str


class MatchRequest(BaseModel):
    participant: Participant

    # Skills the participant/team needs
    required_skills: List[str] = Field(default_factory=list)

    candidates: List[Participant]


@router.post("/match")
def match_participant(request: MatchRequest):

    results = []

    for candidate in request.candidates:

        match = calculate_match(
            user_skills=request.participant.skills,
            required_skills=request.required_skills,
            candidate_skills=candidate.skills,
            user_domain=request.participant.domain,
            candidate_domain=candidate.domain
        )

        results.append({
            "candidate": candidate.name,
            "score": match["score"],
            "missing_skills": match["missing_skills"],
            "complementary_skills": match["complementary_skills"],
            "domain_match": match["domain_match"],
            "reason": match["reason"]
        })

    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return {
        "participant": request.participant.name,
        "matches": results
    }