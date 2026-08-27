import re

from app.rag.retriever import retrieve_context
from app.concierge.answer_generator import generate_answer
from app.matcher.engine import calculate_match
from app.auditor.engine import audit_submission_data
from app.agent.core import analyze_event_state


# ==================================================
# INTENT DEFINITIONS
# ==================================================

INTENT_KEYWORDS = {
    "SCHEDULE": [
        "date",
        "deadline",
        "schedule",
        "when",
        "day 1",
        "day 2",
        "day 3",
        "day 4",
        "judging",
        "judgment",
        "submission time",
        "registration deadline",
        "workshop",
        "mentor round"
    ],

    "TEAM_MATCHING": [
        "team member",
        "teammate",
        "team match",
        "find member",
        "find teammate",
        "missing skill",
        "need frontend",
        "need backend",
        "need ml",
        "need ui",
        "need designer",
        "join team",
        "find developer",
        "find designer"
    ],

    "SUBMISSION": [
        "submission",
        "submit",
        "github",
        "repository",
        "readme",
        "demo video",
        "project link",
        "track eligibility",
        "submission incomplete",
        "missing file",
        "audit submission",
        "check submission"
    ],

    "OPERATIONAL_ISSUE": [
        "api key",
        "not working",
        "cannot access",
        "can't access",
        "mentor booking",
        "hardware",
        "internet issue",
        "wifi",
        "login issue",
        "technical issue",
        "help",
        "problem"
    ],

    "KNOWLEDGE": [
        "team size",
        "prize",
        "prize pool",
        "registration fee",
        "eligible",
        "eligibility",
        "who can participate",
        "domain",
        "technology track",
        "track",
        "rule",
        "allowed",
        "bring",
        "contact",
        "offline",
        "online"
    ]
}


TOOL_MAP = {
    "SCHEDULE": "knowledge_retriever",
    "KNOWLEDGE": "knowledge_retriever",
    "TEAM_MATCHING": "team_matcher",
    "SUBMISSION": "submission_auditor",
    "OPERATIONAL_ISSUE": "operations_resolver",
    "UNKNOWN": "escalation_handler"
}


# ==================================================
# TEXT NORMALIZATION
# ==================================================

def normalize_message(message: str) -> str:

    message = message.lower().strip()

    message = re.sub(
        r"\s+",
        " ",
        message
    )

    return message


# ==================================================
# INTENT CLASSIFICATION
# ==================================================

def classify_intent(message: str):
    """
    Detect the participant's main intent.
    """

    normalized = normalize_message(
        message
    )

    if not normalized:

        return {
            "intent": "UNKNOWN",
            "matched_keywords": []
        }

    scores = {}
    matches = {}

    for intent, keywords in INTENT_KEYWORDS.items():

        matched = [
            keyword
            for keyword in keywords
            if keyword in normalized
        ]

        scores[intent] = len(
            matched
        )

        matches[intent] = matched

    best_intent = max(
        scores,
        key=scores.get
    )

    if scores[best_intent] == 0:

        return {
            "intent": "UNKNOWN",
            "matched_keywords": []
        }

    return {
        "intent": best_intent,
        "matched_keywords": matches[
            best_intent
        ]
    }


# ==================================================
# KNOWLEDGE SOURCE SELECTION
# ==================================================

def choose_knowledge_sources(
    intent: str,
    message: str
):
    """
    Agent decides which official knowledge sources
    should be searched.
    """

    normalized = normalize_message(
        message
    )

    # ------------------------------------------
    # Schedule
    # ------------------------------------------

    if intent == "SCHEDULE":

        return [
            "schedule.txt",
            "event_info.txt"
        ]

    # ------------------------------------------
    # Technology Tracks
    # ------------------------------------------

    technology_terms = [
        "technology track",
        "nlp",
        "machine learning",
        "ml",
        "generative ai",
        "blockchain",
        "cyber security",
        "cybersecurity",
        "cloud computing",
        "iot",
        "quantum",
        "robotics",
        "ar",
        "vr",
        "mlops",
        "devops",
        "fintech"
    ]

    if any(
        term in normalized
        for term in technology_terms
    ):

        return [
            "technology_tracks.txt",
            "event_info.txt"
        ]

    # ------------------------------------------
    # Domains
    # ------------------------------------------

    if "domain" in normalized:

        return [
            "domains.txt",
            "faq.txt",
            "event_info.txt"
        ]

    # ------------------------------------------
    # Rules / General Event Information
    # ------------------------------------------

    general_terms = [
        "team size",
        "member",
        "prize",
        "fee",
        "eligible",
        "eligibility",
        "participate",
        "rule",
        "allowed",
        "bring",
        "contact",
        "offline",
        "online",
        "college"
    ]

    if any(
        term in normalized
        for term in general_terms
    ):

        return [
            "faq.txt",
            "rules.txt",
            "event_info.txt"
        ]

    return None


# ==================================================
# TEAM MATCHER EXECUTION
# ==================================================

def execute_team_matcher(context):
    """
    Execute Team Matcher using structured participant context.
    """

    user_skills = (
        context.get("participant_skills")
        or context.get("current_skills")
        or []
    )

    required_skills = (
        context.get("required_skills")
        or []
    )

    user_domain = (
        context.get("participant_domain")
        or context.get("domain")
        or ""
    )

    candidates = (
        context.get("candidates")
        or []
    )

    # Required context missing
    if (
        not required_skills
        or not candidates
    ):

        return {
            "executed": False,
            "reason": "missing_team_context"
        }

    matches = []

    for candidate in candidates:

        candidate_name = candidate.get(
            "name",
            "Unknown Candidate"
        )

        candidate_skills = candidate.get(
            "skills",
            []
        )

        candidate_domain = candidate.get(
            "domain",
            ""
        )

        result = calculate_match(
            user_skills=user_skills,
            required_skills=required_skills,
            candidate_skills=candidate_skills,
            user_domain=user_domain,
            candidate_domain=candidate_domain
        )

        matches.append({
            "candidate": candidate_name,
            "score": result["score"],
            "missing_skills": result[
                "missing_skills"
            ],
            "complementary_skills": result[
                "complementary_skills"
            ],
            "domain_match": result[
                "domain_match"
            ],
            "reason": result["reason"]
        })

    matches.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return {
        "executed": True,
        "matches": matches,
        "best_match": (
            matches[0]
            if matches
            else None
        )
    }


# ==================================================
# SUBMISSION AUDITOR EXECUTION
# ==================================================

def execute_submission_audit(context):
    """
    Run Submission Auditor and optionally pass its
    result into the proactive risk engine.
    """

    team_name = context.get(
        "team_name"
    )

    if not team_name:

        return {
            "executed": False,
            "reason": "missing_team_name"
        }

    audit = audit_submission_data(
        team_name=team_name,
        github_url=context.get(
            "github_url"
        ),
        demo_url=context.get(
            "demo_url"
        ),
        readme=context.get(
            "readme",
            False
        ),
        problem_statement=context.get(
            "problem_statement"
        ),
        domain=(
            context.get("submission_domain")
            or context.get("domain")
        )
    )

    risk_alert = None

    minutes_to_deadline = context.get(
        "minutes_to_deadline"
    )

    # If deadline context exists and submission
    # is incomplete, trigger proactive risk engine.
    if (
        minutes_to_deadline is not None
        and (
            audit["missing"]
            or audit.get("invalid")
        )
    ):

        alerts = analyze_event_state(
            minutes_to_deadline,
            [
                {
                    "team": team_name,

                    "missing": audit[
                        "missing"
                    ],

                    "invalid": audit.get(
                        "invalid",
                        []
                    ),
                }
            ]
        )

        if alerts:
            risk_alert = alerts[0]

    return {
        "executed": True,
        "audit": audit,
        "risk_alert": risk_alert
    }


# ==================================================
# MAIN AGENT ORCHESTRATOR
# ==================================================

def route_request(
    message: str,
    context=None
):
    """
    Main HACKMIND Agent Orchestrator.

    OBSERVE
        ↓
    UNDERSTAND
        ↓
    SELECT TOOL
        ↓
    EXECUTE TOOL
        ↓
    REASON
        ↓
    DECIDE
        ↓
    ANSWER / ACT / ESCALATE
    """

    if context is None:
        context = {}

    classification = classify_intent(
        message
    )

    intent = classification[
        "intent"
    ]

    tool = TOOL_MAP.get(
        intent,
        "escalation_handler"
    )

    # ==================================================
    # SCHEDULE
    # ==================================================

    if intent == "SCHEDULE":

        allowed_sources = choose_knowledge_sources(
            intent,
            message
        )

        retrieval = retrieve_context(
            message,
            allowed_sources=allowed_sources
        )

        if retrieval["found"]:

            return {
                "intent": intent,
                "matched_keywords": classification[
                    "matched_keywords"
                ],
                "tool": tool,
                "sources_searched": allowed_sources,
                "tool_executed": True,
                "decision": "ANSWER",
                "action": (
                    "Retrieve verified event "
                    "schedule information"
                ),
                "answer": generate_answer(
                    retrieval["context"]
                ),
                "source": retrieval[
                    "source"
                ],
                "retrieval_score": round(
                    retrieval["score"],
                    4
                ),
                "escalate": False
            }

        return {
            "intent": intent,
            "matched_keywords": classification[
                "matched_keywords"
            ],
            "tool": tool,
            "sources_searched": allowed_sources,
            "tool_executed": True,
            "decision": "ESCALATE",
            "action": (
                "Schedule information "
                "could not be verified"
            ),
            "answer": (
                "I could not verify this schedule "
                "information from the official "
                "Learnathon knowledge base."
            ),
            "source": None,
            "retrieval_score": round(
                retrieval["score"],
                4
            ),
            "escalate": True
        }

    # ==================================================
    # GENERAL KNOWLEDGE
    # ==================================================

    if intent == "KNOWLEDGE":

        allowed_sources = choose_knowledge_sources(
            intent,
            message
        )

        retrieval = retrieve_context(
            message,
            allowed_sources=allowed_sources
        )

        if retrieval["found"]:

            return {
                "intent": intent,
                "matched_keywords": classification[
                    "matched_keywords"
                ],
                "tool": tool,
                "sources_searched": allowed_sources,
                "tool_executed": True,
                "decision": "ANSWER",
                "action": (
                    "Return verified "
                    "event information"
                ),
                "answer": generate_answer(
                    retrieval["context"]
                ),
                "source": retrieval[
                    "source"
                ],
                "retrieval_score": round(
                    retrieval["score"],
                    4
                ),
                "escalate": False
            }

        return {
            "intent": intent,
            "matched_keywords": classification[
                "matched_keywords"
            ],
            "tool": tool,
            "sources_searched": allowed_sources,
            "tool_executed": True,
            "decision": "ESCALATE",
            "action": (
                "Reliable information "
                "was not found"
            ),
            "answer": (
                "I could not verify this "
                "information from the official "
                "Learnathon knowledge base."
            ),
            "source": None,
            "retrieval_score": round(
                retrieval["score"],
                4
            ),
            "escalate": True
        }

    # ==================================================
    # TEAM MATCHING
    # ==================================================

    if intent == "TEAM_MATCHING":

        matcher_result = execute_team_matcher(
            context
        )

        # Not enough context yet
        if not matcher_result["executed"]:

            return {
                "intent": intent,
                "matched_keywords": classification[
                    "matched_keywords"
                ],
                "tool": "team_matcher",
                "tool_executed": False,
                "decision": "COLLECT_TEAM_CONTEXT",
                "action": (
                    "Collect required skills "
                    "and candidate data"
                ),
                "answer": (
                    "I detected a team-matching "
                    "request. Provide your current "
                    "skills, required skills, domain "
                    "and candidate pool."
                ),
                "source": None,
                "escalate": False
            }

        best_match = matcher_result[
            "best_match"
        ]

        return {
            "intent": intent,
            "matched_keywords": classification[
                "matched_keywords"
            ],
            "tool": "team_matcher",
            "tool_executed": True,
            "decision": "RECOMMEND_TEAMMATE",
            "action": (
                "Rank candidates by "
                "complementary skills"
            ),
            "answer": (
                f"Best candidate: "
                f"{best_match['candidate']}"
                if best_match
                else "No compatible candidate found."
            ),
            "best_match": best_match,
            "matches": matcher_result[
                "matches"
            ],
            "source": None,
            "escalate": False
        }

    # ==================================================
    # SUBMISSION AUDIT
    # ==================================================

    if intent == "SUBMISSION":

        audit_result = execute_submission_audit(
            context
        )

        if not audit_result["executed"]:

            return {
                "intent": intent,
                "matched_keywords": classification[
                    "matched_keywords"
                ],
                "tool": "submission_auditor",
                "tool_executed": False,
                "decision": "COLLECT_SUBMISSION_CONTEXT",
                "action": (
                    "Collect submission "
                    "information"
                ),
                "answer": (
                    "I detected a submission "
                    "request. Provide the team "
                    "name and submission details."
                ),
                "source": None,
                "escalate": False
            }

        audit = audit_result[
            "audit"
        ]

        risk_alert = audit_result[
            "risk_alert"
        ]

        # Determine final agent decision
        if audit["complete"]:

            decision = "SUBMISSION_READY"

            answer = (
                "Submission completeness "
                "check passed."
            )

            escalate = False

        elif (
            risk_alert
            and risk_alert.get(
                "escalate"
            )
        ):

            decision = "ESCALATE_SUBMISSION_RISK"

            answer = (
                f"{audit['status']}. "
                f"Deadline risk requires "
                f"organizer attention."
            )

            escalate = True

        else:

            decision = "FIX_SUBMISSION"

            answer = audit[
                "status"
            ]

            escalate = False

        return {
            "intent": intent,
            "matched_keywords": classification[
                "matched_keywords"
            ],
            "tool": "submission_auditor",
            "tool_executed": True,
            "decision": decision,
            "action": (
                "Audit submission and evaluate "
                "deadline risk"
            ),
            "answer": answer,
            "audit": audit,
            "risk_alert": risk_alert,
            "source": None,
            "escalate": escalate
        }

    # ==================================================
    # OPERATIONAL ISSUE
    # ==================================================

    if intent == "OPERATIONAL_ISSUE":

        operational_sources = [
            "faq.txt",
            "rules.txt",
            "schedule.txt",
            "resources.txt",
            "event_info.txt"
        ]

        retrieval = retrieve_context(
            message,
            allowed_sources=operational_sources
        )

        if retrieval["found"]:

            return {
                "intent": intent,
                "matched_keywords": classification[
                    "matched_keywords"
                ],
                "tool": "operations_resolver",
                "sources_searched": operational_sources,
                "tool_executed": True,
                "decision": "RESOLVE",
                "action": (
                    "Resolve operational issue "
                    "using verified information"
                ),
                "answer": generate_answer(
                    retrieval["context"]
                ),
                "source": retrieval[
                    "source"
                ],
                "retrieval_score": round(
                    retrieval["score"],
                    4
                ),
                "escalate": False
            }

        return {
            "intent": intent,
            "matched_keywords": classification[
                "matched_keywords"
            ],
            "tool": "operations_resolver",
            "sources_searched": operational_sources,
            "tool_executed": True,
            "decision": "ESCALATE",
            "action": (
                "Escalate unresolved "
                "operational issue"
            ),
            "answer": (
                "I could not safely resolve "
                "this operational issue using "
                "verified event information. "
                "It should be escalated "
                "to an organizer."
            ),
            "source": None,
            "retrieval_score": round(
                retrieval["score"],
                4
            ),
            "escalate": True
        }

    # ==================================================
    # UNKNOWN
    # ==================================================

    # Try knowledge retrieval once before escalation.
    fallback = retrieve_context(
        message
    )

    if fallback["found"]:

        return {
            "intent": "UNKNOWN",
            "matched_keywords": [],
            "tool": "knowledge_retriever",
            "tool_executed": True,
            "decision": "ANSWER_WITH_FALLBACK",
            "action": (
                "Use verified knowledge fallback"
            ),
            "answer": generate_answer(
                fallback["context"]
            ),
            "source": fallback[
                "source"
            ],
            "retrieval_score": round(
                fallback["score"],
                4
            ),
            "escalate": False
        }

    return {
        "intent": "UNKNOWN",
        "matched_keywords": [],
        "tool": "escalation_handler",
        "tool_executed": False,
        "decision": "ESCALATE",
        "action": (
            "Send unresolved query "
            "to human organizer"
        ),
        "answer": (
            "I could not confidently resolve "
            "this request using the available "
            "event tools and verified knowledge."
        ),
        "source": None,
        "escalate": True
    }