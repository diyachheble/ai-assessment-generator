from pathlib import Path

import docx
import pdfplumber


class UnsupportedFileTypeError(Exception):
    pass


def extract_text_from_file(file_path: Path) -> str:
    suffix = file_path.suffix.lower()
    if suffix == ".txt":
        return file_path.read_text(encoding="utf-8", errors="ignore")
    if suffix == ".pdf":
        with pdfplumber.open(str(file_path)) as pdf:
            chunks = [page.extract_text() or "" for page in pdf.pages]
        return "\n".join(chunks)
    if suffix == ".docx":
        document = docx.Document(str(file_path))
        chunks = [paragraph.text for paragraph in document.paragraphs]
        return "\n".join(chunks)

    raise UnsupportedFileTypeError("Only .txt, .pdf, and .docx files are supported.")
