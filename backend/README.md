# Assessment Generator Backend (MVP)

This backend lets you:
- Upload a document (`.txt`, `.pdf`, `.docx`)
- Generate assessments from that document (`mcq` or `short_answer`) in a separate call
- Submit answers
- Retrieve results later

## Tech Stack
- FastAPI
- SQLite (via SQLModel)
- python-docx + pdfplumber for document parsing
- Gemini API via `google-generativeai`

## Run Locally

1. Create virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Add environment file:

```bash
cp .env.example .env
```

Set `GEMINI_API_KEY` in `.env`.

4. Run server:

```bash
uvicorn app.main:app --reload --port 8001
```

Server: `http://127.0.0.1:8001`
Docs: `http://127.0.0.1:8001/docs`

## API Flow

1. `POST /upload` (alias: `/documents/upload`)
- form-data key: `file`
- returns `document_id`
- this step only validates/saves file and stores DB record

2. `POST /generate` (alias: `/assessments/generate`)

```json
{
  "document_id": 1,
  "assessment_type": "mcq",
  "num_questions": 5
}
```

Generation endpoint behavior:
- extracts text from uploaded file
- chunks text to first 3000 chars
- calls Gemini
- strips markdown fences and parses JSON
- stores questions (including correct answers) in DB
- returns questions without exposing `correct_answer`

3. `POST /assessments/{assessment_id}/submit`

```json
{
  "answers": [
    {"question_id": 1, "answer": "A"},
    {"question_id": 2, "answer": "C"}
  ]
}
```

4. `GET /results/{submission_id}`

## Quick cURL Test

1. Health:

```bash
curl -s http://127.0.0.1:8001/health
```

2. Upload:

```bash
curl -X POST "http://127.0.0.1:8001/upload" -F "file=@/absolute/path/to/file.docx"
```

3. Generate:

```bash
curl -X POST "http://127.0.0.1:8001/generate" \
  -H "Content-Type: application/json" \
  -d '{"document_id":1,"assessment_type":"mcq","num_questions":5}'
```

## Notes
- MCQ scoring is automatic (1 point per correct answer).
- Short-answer generation is available, but auto-grading is not implemented yet in this MVP.
- Gemini is used for generation when `GEMINI_API_KEY` is configured.
- If Gemini config/response fails, backend falls back to local rule-based generation.
