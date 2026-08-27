from app.rag.retriever import retrieve_context


questions = [
    "How many members can be in one team?",
    "Is Learnathon online or offline?",
    "What is the prize pool?",
    "When is judgment day?",
    "When is the team registration deadline?",
    "Can Mechanical and CSE students form a team?",
    "What should I bring to the hackathon?",
    "Who can participate?",
    "What is tomorrow's cricket score?"
]


for question in questions:

    result = retrieve_context(question)

    print("\n" + "=" * 70)

    print("QUESTION:")
    print(question)

    print("\nFOUND:")
    print(result["found"])

    print("\nCONTEXT:")
    print(result["context"])

    print("\nSOURCE:")
    print(result["source"])

    print("\nSIMILARITY:")
    print(round(result["score"], 4))