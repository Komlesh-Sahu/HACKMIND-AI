from urllib.parse import urlparse


def is_valid_url(url: str) -> bool:
    """
    Validate basic HTTP/HTTPS URL structure.

    This checks URL format only.
    It does NOT verify whether the website is reachable.
    """
    if not url:
        return False

    try:
        parsed = urlparse(url.strip())

        return (
            parsed.scheme in ["http", "https"]
            and bool(parsed.netloc)
        )

    except Exception:
        return False


def is_valid_github_url(url: str) -> bool:
    """
    Check whether the supplied URL is a valid GitHub URL.

    This validates format + github.com hostname.
    It does NOT inspect repository contents yet.
    """
    if not is_valid_url(url):
        return False

    try:
        parsed = urlparse(url.strip())

        hostname = (parsed.hostname or "").lower()

        return hostname in [
            "github.com",
            "www.github.com",
        ]

    except Exception:
        return False


def audit_submission_data(
    team_name,
    github_url=None,
    demo_url=None,
    readme=False,
    problem_statement=None,
    domain=None,
):
    """
    Submission Auditor v2.

    Performs:
    - presence checks
    - GitHub URL format validation
    - demo URL format validation
    - structured audit output

    Current limitation:
    - URL reachability is not checked yet
    - repository contents are not inspected yet
    - track/domain eligibility is not fully validated yet
    """

    missing = []
    invalid = []

    # ==========================================
    # GITHUB REPOSITORY
    # ==========================================

    github_present = bool(
        github_url and str(github_url).strip()
    )

    github_valid = False

    if not github_present:
        missing.append("GitHub repository")

    else:
        github_valid = is_valid_github_url(
            github_url
        )

        if not github_valid:
            invalid.append(
                "GitHub repository URL"
            )

    # ==========================================
    # DEMO VIDEO / DEMO LINK
    # ==========================================

    demo_present = bool(
        demo_url and str(demo_url).strip()
    )

    demo_valid = False

    if not demo_present:
        missing.append("Demo video")

    else:
        demo_valid = is_valid_url(
            demo_url
        )

        if not demo_valid:
            invalid.append(
                "Demo video URL"
            )

    # ==========================================
    # README
    # ==========================================

    readme_present = bool(readme)

    if not readme_present:
        missing.append("README")

    # ==========================================
    # PROBLEM STATEMENT
    # ==========================================

    problem_present = bool(
        problem_statement
        and str(problem_statement).strip()
    )

    if not problem_present:
        missing.append(
            "Problem statement"
        )

    # ==========================================
    # DOMAIN / TRACK FIELD
    # ==========================================

    domain_present = bool(
        domain and str(domain).strip()
    )

    if not domain_present:
        missing.append(
            "Domain / track"
        )

    # ==========================================
    # FINAL DECISION
    # ==========================================

    complete = (
        len(missing) == 0
        and len(invalid) == 0
    )

    if complete:
        status = "Submission complete"

    elif missing and invalid:
        status = (
            f"Submission incomplete — "
            f"{len(missing)} missing and "
            f"{len(invalid)} invalid requirement(s)"
        )

    elif missing:
        status = (
            f"Submission incomplete — "
            f"{len(missing)} requirement(s) missing"
        )

    else:
        status = (
            f"Submission invalid — "
            f"{len(invalid)} invalid requirement(s)"
        )

    return {
        "team": team_name,

        "complete": complete,

        "status": status,

        "missing": missing,

        "missing_count": len(missing),

        "invalid": invalid,

        "invalid_count": len(invalid),

        "checks": {
            "github": {
                "present": github_present,
                "valid_format": github_valid,
            },

            "demo": {
                "present": demo_present,
                "valid_format": demo_valid,
            },

            "readme": {
                "present": readme_present,
            },

            "problem_statement": {
                "present": problem_present,
            },

            "domain_track": {
                "present": domain_present,
            },
        },
    }