import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question: str, context: str):

    prompt = f"""
You are HACKMIND AI, an AI assistant for a hackathon.

Answer the participant's question using ONLY the official event context provided below.

Rules:
- Do not invent information.
- Do not use outside knowledge.
- If the answer is not present in the context, say:
  "I could not find this information in the official event documents."
- Keep the answer concise and helpful.

OFFICIAL EVENT CONTEXT:
{context}

PARTICIPANT QUESTION:
{question}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1,
        max_tokens=300
    )

    return response.choices[0].message.content