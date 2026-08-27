from pathlib import Path
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# backend/data/documents/
DOCUMENTS_DIR = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "documents"
)

# Minimum raw TF-IDF similarity required.
CONFIDENCE_THRESHOLD = 0.10


def normalize_text(text: str) -> str:
    """
    Normalize common wording variations before similarity comparison.

    Normalization is used only for retrieval.
    Original document text is still returned to the user.
    """

    text = text.lower().strip()

    replacements = {
        "dates": "date",
        "members": "member",
        "teams": "team",
        "deadlines": "deadline",
        "registrations": "registration",
        "submissions": "submission",
        "participants": "participant",
        "colleges": "college",
        "domains": "domain",
        "tracks": "track",
        "rules": "rule",
        "prizes": "prize",
        "workshops": "workshop",
    }

    for old, new in replacements.items():
        text = re.sub(
            rf"\b{re.escape(old)}\b",
            new,
            text
        )

    # Remove unnecessary punctuation
    text = re.sub(
        r"[^\w\s₹/-]",
        " ",
        text
    )

    # Remove repeated spaces
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def load_documents():
    """
    Load all non-empty .txt files from the knowledge base.
    """

    documents = []

    if not DOCUMENTS_DIR.exists():
        return documents

    for file_path in DOCUMENTS_DIR.glob("*.txt"):

        # Ignore old temporary knowledge-base file
        if file_path.name == "event_rules.txt":
            continue

        text = file_path.read_text(
            encoding="utf-8"
        ).strip()

        if not text:
            continue

        documents.append({
            "source": file_path.name,
            "text": text
        })

    return documents


def is_heading(text: str) -> bool:
    """
    Detect short standalone headings that should not
    normally be returned as participant-facing answers.

    Example:
    LEARNATHON 5.0 TECHNOLOGY TRACKS
    """

    cleaned = text.strip()

    if not cleaned:
        return True

    words = cleaned.split()

    if (
        len(words) <= 10
        and cleaned.upper() == cleaned
    ):
        return True

    return False


def create_chunks(documents):
    """
    Break documents into meaningful paragraph-sized chunks.
    """

    chunks = []

    for document in documents:

        paragraphs = [
            paragraph.strip()
            for paragraph in document["text"].split("\n\n")
            if paragraph.strip()
        ]

        for paragraph in paragraphs:

            # Do not use standalone document headings as answers
            if is_heading(paragraph):
                continue

            chunks.append({
                "text": paragraph,
                "normalized_text": normalize_text(
                    paragraph
                ),
                "source": document["source"]
            })

    return chunks


def extract_important_terms(question: str):
    """
    Extract specific query terms.

    Generic conversational/event words are removed,
    leaving useful entities such as:

    NLP
    blockchain
    quantum
    react
    mlops
    fintech
    """

    normalized = normalize_text(question)

    generic_terms = {
        "is",
        "are",
        "am",
        "a",
        "an",
        "the",
        "this",
        "that",
        "what",
        "which",
        "who",
        "where",
        "when",
        "why",
        "how",
        "does",
        "do",
        "did",
        "can",
        "could",
        "would",
        "should",
        "technology",
        "track",
        "learnathon",
        "event",
        "available",
        "included",
        "part",
        "of",
        "in",
        "on",
        "for",
        "to",
        "and",
        "or"
    }

    terms = []

    for word in normalized.split():

        if word in generic_terms:
            continue

        if len(word) < 2:
            continue

        terms.append(word)

    return terms


def retrieve_context(
    question: str,
    allowed_sources=None
):
    """
    Retrieve the most relevant knowledge chunk.

    The retrieval process combines:

    1. Source filtering selected by the Agent
    2. TF-IDF semantic/lexical similarity
    3. Specific entity/keyword ranking boost
    4. Minimum similarity rejection

    allowed_sources example:

    [
        "schedule.txt",
        "event_info.txt"
    ]
    """

    original_question = question.strip()

    if not original_question:

        return {
            "found": False,
            "context": "",
            "source": None,
            "score": 0.0
        }

    normalized_question = normalize_text(
        original_question
    )

    documents = load_documents()

    if not documents:

        return {
            "found": False,
            "context": "",
            "source": None,
            "score": 0.0
        }

    chunks = create_chunks(
        documents
    )

    # ==================================================
    # AGENT-AWARE SOURCE FILTERING
    # ==================================================

    if allowed_sources:

        chunks = [
            chunk
            for chunk in chunks
            if chunk["source"] in allowed_sources
        ]

    if not chunks:

        return {
            "found": False,
            "context": "",
            "source": None,
            "score": 0.0
        }

    normalized_chunks = [
        chunk["normalized_text"]
        for chunk in chunks
    ]

    # ==================================================
    # TF-IDF RETRIEVAL
    # ==================================================

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        lowercase=True,
        sublinear_tf=True
    )

    try:

        vectors = vectorizer.fit_transform(
            [normalized_question]
            + normalized_chunks
        )

    except ValueError:

        return {
            "found": False,
            "context": "",
            "source": None,
            "score": 0.0
        }

    similarities = cosine_similarity(
        vectors[0:1],
        vectors[1:]
    )[0]

    # ==================================================
    # SPECIFIC ENTITY / KEYWORD BOOSTING
    # ==================================================

    important_terms = extract_important_terms(
        original_question
    )

    # Copy raw TF-IDF similarity.
    # Boosting is ONLY for ranking.
    ranking_scores = similarities.copy()

    for index, chunk in enumerate(chunks):

        chunk_text = chunk[
            "normalized_text"
        ]

        matched_terms = []

        for term in important_terms:

            if re.search(
                rf"\b{re.escape(term)}\b",
                chunk_text
            ):
                matched_terms.append(
                    term
                )

        if matched_terms:

            # Give specific entities additional ranking priority.
            #
            # Example:
            # "NLP" should matter more than generic
            # words such as "technology track".
            entity_bonus = min(
                0.20 * len(
                    set(matched_terms)
                ),
                0.40
            )

            ranking_scores[
                index
            ] += entity_bonus

    # Select based on ranking score
    best_index = ranking_scores.argmax()

    # IMPORTANT:
    # This remains the RAW TF-IDF score.
    #
    # We do not expose the artificial ranking bonus
    # as retrieval confidence.
    best_score = float(
        similarities[best_index]
    )

    best_chunk = chunks[
        best_index
    ]

    # ==================================================
    # SAFE REJECTION
    # ==================================================

    if best_score < CONFIDENCE_THRESHOLD:

        return {
            "found": False,
            "context": "",
            "source": None,
            "score": best_score
        }

    return {
        "found": True,
        "context": best_chunk["text"],
        "source": best_chunk["source"],
        "score": best_score
    }