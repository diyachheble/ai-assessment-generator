import json
import os
import re
from typing import List

import google.generativeai as genai
from dotenv import load_dotenv


class GeminiConfigError(Exception):
    pass


class GeminiResponseParseError(Exception):
    pass


load_dotenv()


def _strip_code_fences(text: str) -> str:
    cleaned = text.strip()
    cleaned = re.sub(r"^```json\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"^```\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def generate_questions_with_gemini(
    extracted_text: str,
    assessment_type: str,
    num_questions: int,
) -> List[dict]:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiConfigError("GEMINI_API_KEY is not set. Add it in backend/.env")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Keep prompt size bounded to avoid token overrun and high latency.
    text_chunk = extracted_text[:3000]

    if assessment_type == "mcq":
        format_instruction = (
            "Return ONLY valid JSON array. Each item must contain: "
            "question_id (int), question_text (str), question_type='mcq', "
            "options (array of 4 objects with key A/B/C/D and text), correct_answer (A/B/C/D)."
        )
    else:
        format_instruction = (
            "Return ONLY valid JSON array. Each item must contain: "
            "question_id (int), question_text (str), question_type='short_answer', answer (str)."
        )

    prompt = f"""
You are an assessment generator.
Generate {num_questions} high-quality {assessment_type} questions from the given content.
{format_instruction}
Use ONLY information explicitly present in the provided document content.
Do NOT add outside facts, assumptions, or prior knowledge.
Every question and option must be answerable from this document alone.
Do not include markdown. Do not include explanations outside JSON.

Document content:
{text_chunk}
""".strip()

    response = model.generate_content(prompt)
    raw_text = (response.text or "").strip()
    cleaned = _strip_code_fences(raw_text)

    try:
        parsed = json.loads(cleaned)
    except Exception as exc:
        raise GeminiResponseParseError(f"Failed to parse Gemini JSON response: {exc}") from exc

    if not isinstance(parsed, list):
        raise GeminiResponseParseError("Gemini response was not a JSON array")

    normalized = []
    for idx, item in enumerate(parsed, start=1):
        if not isinstance(item, dict):
            continue
        item["question_id"] = idx
        normalized.append(item)

    return normalized
