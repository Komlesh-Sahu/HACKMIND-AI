from app.services.llm import generate_answer


answer = generate_answer(
    question="Do I need a README?",
    context="""
README:
Every project must contain a README file explaining the project,
setup instructions, technologies used, and usage.
"""
)

print(answer)