import json
import uuid
from pathlib import Path

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.database import get_session, init_db
from app.models import Assessment, Document, Submission
from app.schemas import (
    AssessmentDetailResponse,
    GenerateAssessmentRequest,
    GenerateAssessmentResponse,
    Question,
    SubmitAssessmentRequest,
    SubmitAssessmentResponse,
    SubmissionDetailResponse,
    UploadResponse,
)
from app.services.assessment_generator import generate_assessment
from app.services.ai_generator import (
    GeminiConfigError,
    GeminiResponseParseError,
    generate_questions_with_gemini,
)
from app.services.document_parser import UnsupportedFileTypeError, extract_text_from_file

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Assessment Generator Backend", version="0.1.0")

# Allow local frontend dev servers to call backend APIs from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/documents/upload", response_model=UploadResponse)
@app.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...), session: Session = Depends(get_session)
) -> UploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in {".txt", ".pdf", ".docx"}:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Allowed: .txt, .pdf, .docx",
        )

    safe_name = f"{uuid.uuid4().hex}_{Path(file.filename).name}"
    file_path = UPLOAD_DIR / safe_name
    content = await file.read()
    file_path.write_bytes(content)

    document = Document(
        filename=file.filename,
        file_path=str(file_path),
        extracted_text="",
    )
    session.add(document)
    session.commit()
    session.refresh(document)

    return UploadResponse(
        document_id=document.id,
        filename=document.filename,
        message="Document uploaded successfully",
    )


@app.post("/assessments/generate", response_model=GenerateAssessmentResponse)
@app.post("/generate", response_model=GenerateAssessmentResponse)
def create_assessment(
    payload: GenerateAssessmentRequest, session: Session = Depends(get_session)
) -> GenerateAssessmentResponse:
    document = session.get(Document, payload.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        extracted_text = extract_text_from_file(Path(document.file_path))
    except UnsupportedFileTypeError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {exc}") from exc

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract meaningful text")

    document.extracted_text = extracted_text
    session.add(document)

    generation_source = "gemini"
    try:
        questions = generate_questions_with_gemini(
            extracted_text=extracted_text,
            assessment_type=payload.assessment_type,
            num_questions=payload.num_questions,
        )
        questions_json = json.dumps(questions)
    except (GeminiConfigError, GeminiResponseParseError):
        generation_source = "rule_based_fallback"
        questions_json = generate_assessment(
            text=extracted_text,
            assessment_type=payload.assessment_type,
            num_questions=payload.num_questions,
        )

    assessment = Assessment(
        document_id=document.id,
        title=f"Assessment for {document.filename}",
        assessment_type=payload.assessment_type,
        num_questions=payload.num_questions,
        questions_json=questions_json,
    )
    session.add(assessment)
    session.commit()
    session.refresh(assessment)

    questions = [Question(**item) for item in json.loads(assessment.questions_json)]
    return GenerateAssessmentResponse(
        assessment_id=assessment.id,
        document_id=assessment.document_id,
        assessment_type=assessment.assessment_type,
        generation_source=generation_source,
        questions=questions,
    )


@app.get("/assessments/{assessment_id}", response_model=AssessmentDetailResponse)
def get_assessment(assessment_id: int, session: Session = Depends(get_session)) -> AssessmentDetailResponse:
    assessment = session.get(Assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = [Question(**item) for item in json.loads(assessment.questions_json)]
    return AssessmentDetailResponse(
        assessment_id=assessment.id,
        document_id=assessment.document_id,
        title=assessment.title,
        assessment_type=assessment.assessment_type,
        questions=questions,
        created_at=assessment.created_at,
    )


@app.post("/assessments/{assessment_id}/submit", response_model=SubmitAssessmentResponse)
def submit_assessment(
    assessment_id: int,
    payload: SubmitAssessmentRequest,
    session: Session = Depends(get_session),
) -> SubmitAssessmentResponse:
    assessment = session.get(Assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = json.loads(assessment.questions_json)
    submitted_map = {item.question_id: item.answer for item in payload.answers}

    score = 0.0
    max_score = float(len(questions))

    for question in questions:
        qid = question["question_id"]
        expected = question.get("correct_answer")
        if question["question_type"] == "mcq" and expected is not None:
            user_answer = submitted_map.get(qid)
            if user_answer is not None and str(user_answer).strip().upper() == str(expected).strip().upper():
                score += 1.0

    percentage = (score / max_score * 100.0) if max_score > 0 else 0.0

    submission = Submission(
        assessment_id=assessment.id,
        answers_json=payload.model_dump_json(),
        score=score,
        max_score=max_score,
        percentage=percentage,
    )
    session.add(submission)
    session.commit()
    session.refresh(submission)

    return SubmitAssessmentResponse(
        submission_id=submission.id,
        assessment_id=submission.assessment_id,
        score=submission.score,
        max_score=submission.max_score,
        percentage=submission.percentage,
    )


@app.get("/results/{submission_id}", response_model=SubmissionDetailResponse)
def get_result(submission_id: int, session: Session = Depends(get_session)) -> SubmissionDetailResponse:
    submission = session.get(Submission, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    return SubmissionDetailResponse(
        submission_id=submission.id,
        assessment_id=submission.assessment_id,
        score=submission.score,
        max_score=submission.max_score,
        percentage=submission.percentage,
        created_at=submission.created_at,
        answers=json.loads(submission.answers_json).get("answers", []),
    )


@app.get("/documents")
def list_documents(session: Session = Depends(get_session)):
    docs = session.exec(select(Document)).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "created_at": d.created_at,
        }
        for d in docs
    ]
