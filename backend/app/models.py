from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    file_path: str
    extracted_text: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Assessment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: int = Field(index=True)
    title: str
    assessment_type: str
    num_questions: int
    questions_json: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Submission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assessment_id: int = Field(index=True)
    answers_json: str
    score: float
    max_score: float
    percentage: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
