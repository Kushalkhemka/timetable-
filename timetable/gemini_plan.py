import os
import sys
import json
from typing import Optional

from google import genai
from google.genai import types


PROMPT = """
You are given syllabus markdown extracted from a curriculum PDF.
1) Parse it into JSON: { "course": string, "units": [{ "name": string, "contactHours": number, "topics": string[] }]}.
   Extract contact hours per unit from tables (S.No | Contents | Contact Hours) or inline text.
2) Create a strict plan with 60-minute session slots. For each unit, split topics into subtopics with durations that are
   multiples of 60 so the total equals contactHours*60 for that unit. Obey topic order when implied.
3) Output ONLY valid JSON with this exact shape:
   { "course": string, "slotMinutes": 60, "units": [ { "name": string, "contactHours": number,
       "topics": [ { "title": string, "minutes": number } ],
       "sessions": [ { "session": number, "minutes": number, "topicTitles": string[] } ]
     } ], "notes": string[] }

Markdown:
"""


def main() -> int:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Missing GEMINI_API_KEY", file=sys.stderr)
        return 2

    markdown = sys.stdin.read()
    if not markdown:
        print("No markdown provided on stdin", file=sys.stderr)
        return 2

    client = genai.Client(api_key=api_key)

    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        thinking_config=types.ThinkingConfig(thinking_budget=-1),
    )

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=PROMPT + "\n" + markdown),
            ],
        )
    ]

    # Stream and accumulate to handle large outputs
    chunks = []
    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-pro",
        contents=contents,
        config=config,
    ):
        if chunk.text:
            chunks.append(chunk.text)

    output = "".join(chunks).strip()
    # Print raw text; server will parse JSON
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


