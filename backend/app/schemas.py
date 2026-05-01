from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    document_id: int
    filename: str
    message: str


class GenerateAssessmentRequest(BaseModel):
    document_id: int
    assessment_type: str = Field(default="mcq", pattern="^(mcq|short_answer)$")
    num_questions: int = Field(default=5, ge=1, le=20)


class QuestionOption(BaseModel):
    key: str
    text: str


class Question(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    options: Optional[List[QuestionOption]] = None
    correct_answer: Optional[str] = None


class GenerateAssessmentResponse(BaseModel):
    assessment_id: int
    document_id: int
    assessment_type: str
    generation_source: str
    questions: List[Question]


class SubmitAnswerItem(BaseModel):
    question_id: int
    answer: Any


class SubmitAssessmentRequest(BaseModel):
    answers: List[SubmitAnswerItem]


class SubmitAssessmentResponse(BaseModel):
    submission_id: int
    assessment_id: int
    score: float
    max_score: float
    percentage: float


class AssessmentDetailResponse(BaseModel):
    assessment_id: int
    document_id: int
    title: str
    assessment_type: str
    questions: List[Question]
    created_at: datetime


class SubmissionDetailResponse(BaseModel):
    submission_id: int
    assessment_id: int
    score: float
    max_score: float
    percentage: float
    created_at: datetime
    answers: list
