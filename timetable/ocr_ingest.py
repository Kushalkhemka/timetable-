import os
import sys
import json
import base64
from typing import List

"""
Strict Mistral OCR using OCR API (no fallback).

Implementation details:
- Encodes whole PDF to base64 and calls client.ocr.process with model
- Requests markdown output
- Exits non-zero on any failure

Environment:
- MISTRAL_API_KEY must be set
- MISTRAL_OCR_MODEL optional (default: mistral-ocr-latest)

Output JSON to stdout on success:
{ "pages": [{ "markdown": string }] }
"""


def encode_pdf_to_base64(pdf_path: str) -> str:
    with open(pdf_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def call_mistral_ocr_markdown_from_file(pdf_path: str) -> dict:
    from mistralai import Mistral

    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        raise RuntimeError("Missing MISTRAL_API_KEY")

    model = os.environ.get("MISTRAL_OCR_MODEL", "mistral-ocr-latest")
    client = Mistral(api_key=api_key)

    # Use data URL via document_url per OCR API schema
    b64 = encode_pdf_to_base64(pdf_path)
    resp = client.ocr.process(
        model=model,
        document={
            "type": "document_url",
            "document_url": f"data:application/pdf;base64,{b64}",
        },
        include_image_base64=False,
    )

    # Convert to dict for stable downstream handling
    if hasattr(resp, "model_dump"):
        data = resp.model_dump()
    elif isinstance(resp, dict):
        data = resp
    else:
        # best-effort
        data = json.loads(json.dumps(resp, default=lambda o: getattr(o, "__dict__", str(o))))
    return data


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: ocr_ingest.py <pdf_path>", file=sys.stderr)
        return 2

    pdf_path = sys.argv[1]
    if not os.path.isfile(pdf_path):
        print("File not found: " + pdf_path, file=sys.stderr)
        return 2

    try:
        data = call_mistral_ocr_markdown_from_file(pdf_path)
        # Expect pages with markdown/text
        pages = data.get("pages") if isinstance(data, dict) else None
        if not pages or not isinstance(pages, list):
            raise RuntimeError("Mistral OCR returned no pages")
        md_pages: List[str] = []
        for p in pages:
            if not isinstance(p, dict):
                continue
            md = p.get("markdown") or p.get("text") or ""
            md_pages.append(str(md))
        if not md_pages:
            raise RuntimeError("Mistral OCR returned empty content")
        out = {"pages": [{"markdown": "\n\n".join(md_pages)}]}
        print(json.dumps(out))
        return 0
    except Exception as e:
        print(f"Mistral OCR error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())


