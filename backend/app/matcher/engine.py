def normalize_skills(skills):
    return {
        skill.strip().lower()
        for skill in skills
        if skill.strip()
    }


def calculate_match(
    user_skills,
    required_skills,
    candidate_skills,
    user_domain,
    candidate_domain
):
    user_skills = normalize_skills(user_skills)
    required_skills = normalize_skills(required_skills)
    candidate_skills = normalize_skills(candidate_skills)

    # Skills the current team is missing
    missing_skills = required_skills - user_skills

    # Skills the candidate can contribute
    complementary_skills = missing_skills & candidate_skills

    if missing_skills:
        skill_score = (
            len(complementary_skills)
            / len(missing_skills)
        )
    else:
        skill_score = 0

    # Domain compatibility
    domain_match = (
        user_domain.strip().lower()
        == candidate_domain.strip().lower()
    )

    domain_score = 0.2 if domain_match else 0

    final_score = min(
        100,
        round((skill_score * 0.8 + domain_score) * 100)
    )

    if complementary_skills:
        reason = (
            "Candidate provides missing skills: "
            + ", ".join(sorted(complementary_skills))
        )
    elif domain_match:
        reason = (
            "Candidate matches the preferred domain, "
            "but adds few missing technical skills."
        )
    else:
        reason = (
            "Candidate has limited complementary skills "
            "for the current team."
        )

    return {
        "score": final_score,
        "missing_skills": sorted(missing_skills),
        "complementary_skills": sorted(complementary_skills),
        "domain_match": domain_match,
        "reason": reason
    }