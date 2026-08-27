from typing import List, Dict


def analyze_event_state(
    minutes_to_deadline: int,
    submissions: List[Dict]
):
    """
    Analyze current submission risk.

    Supports:
    - missing requirements
    - invalid requirements
    - deadline-aware priority
    - escalation decisions
    """

    alerts = []

    for submission in submissions:

        missing = submission.get(
            "missing",
            []
        )

        invalid = submission.get(
            "invalid",
            []
        )

        # Combine all submission problems
        issues = missing + invalid

        # No problems → no alert
        if not issues:
            continue

        # ======================================
        # DEADLINE PRIORITY
        # ======================================

        if minutes_to_deadline <= 30:
            priority = "CRITICAL"
            urgency_score = 90

        elif minutes_to_deadline <= 60:
            priority = "HIGH"
            urgency_score = 70

        elif minutes_to_deadline <= 180:
            priority = "MEDIUM"
            urgency_score = 40

        else:
            priority = "LOW"
            urgency_score = 20

        # ======================================
        # ISSUE SEVERITY CONTRIBUTION
        # ======================================

        issue_count = len(issues)

        urgency_score += min(
            issue_count * 3,
            10
        )

        urgency_score = min(
            urgency_score,
            100
        )

        # ======================================
        # ESCALATION POLICY
        # ======================================

        escalate = (
            priority in [
                "CRITICAL",
                "HIGH",
            ]
            and issue_count >= 2
        )

        # ======================================
        # HUMAN-READABLE ACTION
        # ======================================

        action = (
            f"Alert {submission['team']} "
            f"to resolve: {', '.join(issues)}."
        )

        alerts.append({
            "team": submission["team"],

            "missing": missing,

            "invalid": invalid,

            "issues": issues,

            "missing_count": len(missing),

            "invalid_count": len(invalid),

            "issue_count": issue_count,

            "priority": priority,

            "urgency_score": urgency_score,

            "escalate": escalate,

            "action": action,
        })

    alerts.sort(
        key=lambda alert:
        alert["urgency_score"],
        reverse=True
    )

    return alerts