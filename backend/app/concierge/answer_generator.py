def generate_answer(context: str) -> str:
    """
    Convert retrieved knowledge-base context into
    a cleaner participant-facing answer.

    This function does NOT invent new information.
    It only reformats retrieved content.
    """

    if not context:
        return ""

    lines = [
        line.strip()
        for line in context.splitlines()
        if line.strip()
    ]

    # FAQ format:
    # Q: ...
    # A: ...
    for line in lines:
        if line.lower().startswith("a:"):
            return line[2:].strip()

    # If it is not FAQ content,
    # return the retrieved context unchanged.
    return " ".join(lines)