import json
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
APP_DIR = PROJECT_ROOT / 'cmmc-testbank'
TXT_PATH = APP_DIR / 'Cyber_AB-CMMC-CCP_QA_only_v2_spaced copy.txt'
DATA_DIR = APP_DIR / 'data'
RAW_TEXT_PATH = DATA_DIR / 'raw_text.txt'
QUESTIONS_JSON_PATH = DATA_DIR / 'questions.json'


def clean_explanation(text: str) -> str:
    # Remove common boilerplate phrases
    text = re.sub(r'(?i)Why the Correct Answer is.*?\?', '', text)
    text = re.sub(r'(?i)Why Not the Other Options.*?\?', '', text)
    text = re.sub(r'(?i)Relevant CMMC 2\.0 References.*?$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(?i)Official References from CMMC 2\.0.*?$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(?i)Final Verification and Conclusion.*?$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(?i)Final Answer:#.*?$', '', text, flags=re.MULTILINE)
    # Remove headers/footers that repeat
    text = re.sub(r'Leaders in it certification', '', text, flags=re.MULTILINE)
    text = re.sub(r'Practice Exam', '', text, flags=re.MULTILINE)
    text = re.sub(r'Cyber AB - CMMC-CCP', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\d+ of \d+$', '', text, flags=re.MULTILINE)
    # Collapse multiple newlines and extra spaces
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_raw_text() -> str:
    print(f'Reading text from: {TXT_PATH}')
    raw = TXT_PATH.read_text(encoding='utf-8')
    # Remove all 'N of 246' style page markers
    cleaned = re.sub(r'\b\d+\s+of\s+\d+\b', '', raw)
    return cleaned


def parse_questions(text: str) -> list[dict]:
    import re

    # Remove page markers like "17 of 246" and other noise that can break splits
    cleaned = re.sub(r'\n?\d+ of \d+\n?', '\n', text)

    questions = []
    # Find all question headers and their positions
    pattern = re.compile(r'Question\s*#:\s*(\d+)\s*-\s*\[(.*?)\]')
    matches = list(pattern.finditer(cleaned))

    for idx, m in enumerate(matches):
        q_num = int(m.group(1))
        domain = m.group(2).strip()
        start = m.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(cleaned)
        content = cleaned[start:end].strip()

        # Find the Answer line first to get the answer letter
        answer_match = re.search(r'Answer:\s*([A-D])', content)
        if not answer_match:
            continue
        
        correct_letter = answer_match.group(1)
        
        # For Q1 debug: print the first 200 chars to see what we're parsing
        if q_num == 1:
            print(f"DEBUG Q1 content[:200]: {repr(content[:200])}")
            print(f"DEBUG Q1 answer_match: {repr(answer_match.group())}")
        
        # Extract question text and choices from full content before splitting
        q_match = re.search(r'(.*?)\s*A\.\s*(.*)', content, re.DOTALL)
        if not q_match:
            continue
        question_text = q_match.group(1).strip()
        
        # Extract choices from full content, with D stopping at Answer:
        a_match = re.search(r'A\.\s*(.*?)(?=B\.\s*|$)', content, re.DOTALL)
        b_match = re.search(r'B\.\s*(.*?)(?=C\.\s*|$)', content, re.DOTALL)
        c_match = re.search(r'C\.\s*(.*?)(?=D\.\s*|$)', content, re.DOTALL)
        d_match = re.search(r'D\.\s*(.*?)(?=\s*Answer:)', content, re.DOTALL)  # Stop before Answer
        
        a_text = a_match.group(1).strip() if a_match else ''
        b_text = b_match.group(1).strip() if b_match else ''
        c_text = c_match.group(1).strip() if c_match else ''
        d_text = d_match.group(1).strip() if d_match else ''
        
        # Split content for explanation (everything after Answer line)
        explanation_part = content[answer_match.end():].strip()
        
        choices = [
            {'id': 'A', 'text': a_text, 'correct': correct_letter == 'A'},
            {'id': 'B', 'text': b_text, 'correct': correct_letter == 'B'},
            {'id': 'C', 'text': c_text, 'correct': correct_letter == 'C'},
            {'id': 'D', 'text': d_text, 'correct': correct_letter == 'D'},
        ]

        # Validate that all choices have text
        if any(not choice['text'] for choice in choices):
            print(f"Warning: Q{q_num} has empty choice(s)")

        # Clean explanation part separately
        explanation = clean_explanation(explanation_part) if explanation_part else ''

        questions.append({
            'id': f'Q{q_num}',
            'domain': domain,
            'question': question_text,
            'choices': choices,
            'explanation': explanation,
            'reference': ''
        })
    return questions


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    raw_text = extract_raw_text()
    RAW_TEXT_PATH.write_text(raw_text, encoding='utf-8')

    questions = parse_questions(raw_text)
    QUESTIONS_JSON_PATH.write_text(json.dumps(questions, indent=2), encoding='utf-8')

    print(f'Extracted text written to: {RAW_TEXT_PATH}')
    print(f'Parsed {len(questions)} questions to: {QUESTIONS_JSON_PATH}')
    print('You can now refresh the React app to see the real question bank.')


if __name__ == '__main__':
    main()
