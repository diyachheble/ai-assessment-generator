import json
import random
import re
from typing import Dict, List


CONNECTOR_PATTERN = re.compile(
    r"^(?P<subject>.+?)\s+(?:is|are|means|refers to|allows|includes|contains|occurs when|happens when|requires|uses|provides|can|may|must|will|becomes|become|maps|abstracts)\s+(?P<predicate>.+)$",
    flags=re.IGNORECASE,
)


def _clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def _normalize_item(text: str) -> str:
    # Remove list/bullet prefixes like "1.", "-", "a)".
    text = re.sub(r"^\s*(?:[-*•]+|\d+[.)]|[A-Za-z][.)])\s*", "", text)
    return _clean_text(text)


def _split_candidates(text: str) -> List[str]:
    lines = [_normalize_item(line) for line in text.splitlines()]
    lines = [line for line in lines if line]

    collapsed = _clean_text(text)
    sentence_parts = [_normalize_item(s) for s in re.split(r"(?<=[.!?])\s+", collapsed)]
    sentence_parts = [part for part in sentence_parts if part]

    seen = set()
    candidates: List[str] = []
    for item in lines + sentence_parts:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        candidates.append(item)

    return candidates


def _extract_facts(text: str) -> List[Dict[str, str]]:
    candidates = _split_candidates(text)
    facts: List[Dict[str, str]] = []
    seen = set()

    for item in candidates:
        if len(item.split()) < 6:
            continue

        subject = ""
        predicate = ""

        colon_match = re.match(r"^(?P<subject>[A-Za-z][A-Za-z0-9\s\-/]{2,80}):\s*(?P<predicate>.+)$", item)
        if colon_match:
            subject = _clean_text(colon_match.group("subject"))
            predicate = _clean_text(colon_match.group("predicate"))
        else:
            connector_match = CONNECTOR_PATTERN.match(item)
            if connector_match:
                subject = _clean_text(connector_match.group("subject"))
                predicate = _clean_text(connector_match.group("predicate"))

        if not subject or not predicate:
            continue

        # Skip weak/noisy fragments.
        if len(subject.split()) > 12:
            continue
        if len(predicate.split()) < 4:
            continue

        predicate = predicate.rstrip(". ") + "."
        key = f"{subject.lower()}||{predicate.lower()}"
        if key in seen:
            continue
        seen.add(key)

        facts.append(
            {
                "subject": subject,
                "predicate": predicate,
                "source": item.rstrip(". ") + ".",
            }
        )

    return facts


def _extract_statements(text: str) -> List[str]:
    statements = []
    for part in _split_candidates(text):
        if len(part.split()) < 7:
            continue
        clean_part = part.rstrip(". ") + "."
        statements.append(clean_part)

    seen = set()
    unique: List[str] = []
    for statement in statements:
        key = statement.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(statement)

    return unique


def _make_mcq_from_facts(
    facts: List[Dict[str, str]],
    statements: List[str],
    num_questions: int,
) -> List[Dict]:
    if not facts:
        return []

    shuffled = facts[:]
    random.shuffle(shuffled)
    selected = shuffled[:num_questions] if len(shuffled) >= num_questions else shuffled

    while len(selected) < num_questions:
        selected.append(random.choice(shuffled))

    questions: List[Dict] = []
    for idx, fact in enumerate(selected, start=1):
        distractor_pool = [f["predicate"] for f in facts if f["subject"].lower() != fact["subject"].lower()]
        random.shuffle(distractor_pool)

        option_texts: List[str] = []
        seen_option_keys = set()

        def add_unique(candidate: str) -> None:
            key = candidate.lower().strip()
            if not key or key in seen_option_keys:
                return
            seen_option_keys.add(key)
            option_texts.append(candidate)

        add_unique(fact["predicate"])

        for candidate in distractor_pool:
            add_unique(candidate)
            if len(option_texts) == 4:
                break

        # Backfill from any predicate if there are very few distinct subjects.
        if len(option_texts) < 4:
            all_predicates = [f["predicate"] for f in facts]
            random.shuffle(all_predicates)
            for candidate in all_predicates:
                add_unique(candidate)
                if len(option_texts) == 4:
                    break

        # Backfill from complete statements extracted from the same document.
        if len(option_texts) < 4:
            random.shuffle(statements)
            for candidate in statements:
                add_unique(candidate)
                if len(option_texts) == 4:
                    break

        # Absolute fallback to preserve API contract.
        while len(option_texts) < 4:
            option_texts.append(fact["predicate"])

        option_texts = option_texts[:4]
        random.shuffle(option_texts)

        labels = ["A", "B", "C", "D"]
        options = []
        correct_label = "A"
        for opt_idx, text_value in enumerate(option_texts):
            label = labels[opt_idx]
            options.append({"key": label, "text": text_value})
            if text_value.lower() == fact["predicate"].lower():
                correct_label = label

        questions.append(
            {
                "question_id": idx,
                "question_text": f"Which statement correctly describes {fact['subject']} according to the document?",
                "question_type": "mcq",
                "options": options,
                "correct_answer": correct_label,
            }
        )

    return questions


def _make_mcq_from_statements(statements: List[str], num_questions: int) -> List[Dict]:
    if not statements:
        return [
            {
                "question_id": i,
                "question_text": "Which statement is supported by the uploaded document?",
                "question_type": "mcq",
                "options": [
                    {"key": "A", "text": "Not enough readable content found in the uploaded document."},
                    {"key": "B", "text": "Not enough readable content found in the uploaded document."},
                    {"key": "C", "text": "Not enough readable content found in the uploaded document."},
                    {"key": "D", "text": "Not enough readable content found in the uploaded document."},
                ],
                "correct_answer": "A",
            }
            for i in range(1, num_questions + 1)
        ]

    shuffled = statements[:]
    random.shuffle(shuffled)
    selected = shuffled[:num_questions] if len(shuffled) >= num_questions else shuffled

    while len(selected) < num_questions:
        selected.append(random.choice(shuffled))

    questions = []
    for idx, correct in enumerate(selected, start=1):
        distractors = [s for s in statements if s.lower() != correct.lower()]
        random.shuffle(distractors)

        option_texts = [correct] + distractors[:3]
        while len(option_texts) < 4:
            option_texts.append(correct)
        option_texts = option_texts[:4]
        random.shuffle(option_texts)

        labels = ["A", "B", "C", "D"]
        options = []
        correct_label = "A"
        for opt_idx, text_value in enumerate(option_texts):
            label = labels[opt_idx]
            options.append({"key": label, "text": text_value})
            if text_value.lower() == correct.lower():
                correct_label = label

        questions.append(
            {
                "question_id": idx,
                "question_text": "Which statement is explicitly supported by the document?",
                "question_type": "mcq",
                "options": options,
                "correct_answer": correct_label,
            }
        )

    return questions


def generate_mcq_questions(text: str, num_questions: int) -> List[Dict]:
    facts = _extract_facts(text)
    statements = _extract_statements(text)
    if facts:
        return _make_mcq_from_facts(facts, statements, num_questions)

    return _make_mcq_from_statements(statements, num_questions)


def generate_short_answer_questions(text: str, num_questions: int) -> List[Dict]:
    facts = _extract_facts(text)
    if facts:
        shuffled = facts[:]
        random.shuffle(shuffled)
        selected = shuffled[:num_questions] if len(shuffled) >= num_questions else shuffled

        while len(selected) < num_questions:
            selected.append(random.choice(shuffled))

        return [
            {
                "question_id": idx,
                "question_text": f"In your own words, explain {fact['subject']}.",
                "question_type": "short_answer",
                "answer": fact["predicate"],
            }
            for idx, fact in enumerate(selected, start=1)
        ]

    statements = _extract_statements(text)
    if not statements:
        return [
            {
                "question_id": i,
                "question_text": f"Describe one key idea from the uploaded document. ({i})",
                "question_type": "short_answer",
                "answer": "Open ended",
            }
            for i in range(1, num_questions + 1)
        ]

    random.shuffle(statements)
    selected = statements[:num_questions] if len(statements) >= num_questions else statements
    while len(selected) < num_questions:
        selected.append(random.choice(statements))

    return [
        {
            "question_id": idx,
            "question_text": "Explain the following document statement in your own words.",
            "question_type": "short_answer",
            "answer": sentence,
        }
        for idx, sentence in enumerate(selected, start=1)
    ]


def generate_assessment(text: str, assessment_type: str, num_questions: int) -> str:
    if assessment_type == "mcq":
        questions = generate_mcq_questions(text, num_questions)
    else:
        questions = generate_short_answer_questions(text, num_questions)

    return json.dumps(questions)
