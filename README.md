# CMMC CCP Test Bank

An interactive web application for studying the Certified CMMC Professional (CCP) exam with 206 practice questions, multiple study modes, and comprehensive scoring analytics.

## Features

### Study Modes
- **Practice Mode**: Answer questions with immediate feedback and explanations
- **Simulated Test**: Full exam experience with 70% pass/fail threshold and category scoring
- **Rapid Memory**: Q&A flashcards for quick review (no multiple choice)
- **Review Missed**: Focus on questions you answered incorrectly

### UI Features
- **Dark Mode**: Easy-on-the-eyes dark theme
- **Text Sizing**: Small, Medium, Large, and Extra Large text options
- **Mark for Review**: Flag questions during simulated tests
- **Progress Tracking**: Visual progress bars and question navigation
- **Category Breakdown**: Performance analysis by domain
- **Persistent State**: Your preferences and missed questions are saved locally

## Question Categories

The 206 questions are organized into these domains:
- CMMC Assessment Process (CAP)
- CMMC Ecosystem
- Implementation and Scoping
- Roles and Responsibilities
- CMMC Model Overview
- Governance and Source Documents

## Updating the Question Bank

### Adding/Modifying Questions

1. Edit `data/questions.json` with your updates
2. Each question must follow this structure:
```json
{
  "id": "Q1",
  "domain": "CMMC Assessment Process (CAP)",
  "question": "Your question text here",
  "choices": [
    { "id": "A", "text": "First option", "correct": false },
    { "id": "B", "text": "Second option", "correct": true },
    { "id": "C", "text": "Third option", "correct": false },
    { "id": "D", "text": "Fourth option", "correct": false }
  ],
  "explanation": "Detailed explanation of why B is correct",
  "reference": "Optional reference or citation"
}
```

### Important Notes
- `id` must be unique (format: "Q#" where # is the question number)
- `domain` must match one of the 6 categories listed above
- Exactly one choice must have `"correct": true`
- Explanations should be concise but informative
- Questions are displayed in the order they appear in the JSON

### Parsing New Questions from PDF

If you need to parse questions from a new PDF:

1. Convert the PDF to plain text (use Adobe Acrobat or similar)
2. Save the text file as `Cyber_AB-CMMC-CCP_QA_only_v2_spaced copy.txt` in the project root
3. Run the parser:
```bash
python3 scripts/extract_cmmc_questions.py
```

The parser will:
- Extract all questions with their choices and explanations
- Handle various formatting inconsistencies
- Clean explanations by removing boilerplate text
- Output to `data/questions.json`

## Technical Details

### Technologies Used
- React 18 with Vite for fast development
- Tailwind CSS for responsive styling
- localStorage for state persistence
- Python with regex for PDF parsing

### File Structure
```
cmmc-testbank/
├── data/
│   └── questions.json          # All 206 questions
├── scripts/
│   └── extract_cmmc_questions.py  # PDF parsing script
├── src/
│   ├── components/
│   │   ├── PracticeMode.jsx    # Practice mode UI
│   │   ├── SimulatedTest.jsx   # Full test experience
│   │   ├── RapidMemory.jsx     # Flashcard mode
│   │   └── ReviewMissed.jsx    # Review incorrect answers
│   ├── contexts/
│   │   └── TestModeContext.jsx # Global state management
│   └── App.jsx                 # Main application
└── README.md                   # This file
```

### State Management
The app uses React Context (`TestModeContext`) to manage:
- Current study mode
- Dark mode preference
- Text size setting
- Missed questions list
- Marked for review questions
- Simulated test answers

All preferences are automatically saved to localStorage and persist between sessions.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

4. Choose your study mode from the navigation bar

## Performance Notes

- The app loads all 206 questions at startup for instant navigation
- Question navigator shows visual indicators for attempted/correct answers
- Simulated tests calculate category scores on completion
- No external API calls - everything runs locally

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

For personal study use only. Questions are sourced from the Cyber AB CMMC-CCP practice materials.
