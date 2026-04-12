# FRONTEND SETUP & RUN GUIDE

## Quick Start

1. Install dependencies:
```bash
cd /Users/diyachheble/Desktop/Major/frontend
npm install
```

2. Start dev server:
```bash
npm run dev
```

Frontend will be at: **http://localhost:3000**

## Ensure Backend is Running

Backend must be running on **http://localhost:8001** before testing:

```bash
cd /Users/diyachheble/Desktop/Major/backend
cp .env.example .env
# Add your GEMINI_API_KEY to .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AnalyticsCards.jsx      (Dashboard stat cards)
│   │   ├── UploadBox.jsx           (Drag & drop file upload with modern UI)
│   │   ├── Loader.jsx              (Spinning loader animation)
│   │   ├── Assessment.jsx          (Full test-taking interface)
│   │   ├── QuestionCard.jsx        (MCQ option card with radio)
│   │   ├── QuestionPalette.jsx     (Question grid navigator)
│   │   └── Result.jsx              (Score display with answer review)
│   ├── pages/
│   │   └── Home.jsx                (Dashboard landing page)
│   ├── services/
│   │   └── api.js                  (Axios API client & endpoints)
│   ├── hooks/
│   │   └── useProctoring.js        (Tab switch, copy-paste, right-click detection)
│   ├── App.jsx                     (App router component)
│   ├── main.jsx                    (Entry point)
│   └── index.css                   (Tailwind imports)
├── index.html                      (HTML template)
├── vite.config.js                  (Vite config)
├── tailwind.config.js              (Tailwind setup)
├── postcss.config.js               (PostCSS config)
├── package.json                    (Dependencies)
└── README.md                       (This file)
```

## Features Implemented

### Home Page (Dashboard)
- ✓ 4 analytics cards (responsive grid)
- ✓ Modern drag & drop upload area
- ✓ File type validation (PDF, DOCX only)
- ✓ Loading state during generation
- ✓ Styled with Tailwind only

### Assessment Page (Test Taking)
- ✓ Two-column layout (left: questions, right: palette)
- ✓ Question with MCQ options
- ✓ Selected option highlights with blue border
- ✓ 10-minute countdown timer
- ✓ Real-time question palette with color coding:
  - Green = answered
  - Orange = unanswered
  - Blue = current
  - Gray = not visited
- ✓ Jump to any question via palette
- ✓ Previous/Next navigation
- ✓ Clear response button
- ✓ Submit button (disabled during tab switch violations)

### Proctoring Features
- ✓ Disable right-click on assessment page
- ✓ Detect and warn on copy-paste attempt
- ✓ Detect tab switch and show warning
- ✓ Terminate assessment after 3 tab violations
- ✓ Violations persist throughout test
- ✓ Custom hook: `useProctoring()`

### Result Page
- ✓ Large score badge (X/Y format)
- ✓ Percentage display with pass/fail badge
- ✓ Confetti animation for scores > 50%
- ✓ Full answer review:
  - Shows user's answer with checkmark (✓) or X
  - Shows correct answer in green
  - Color-coded (red = wrong, green = correct)
- ✓ Start new assessment button

## API Integration

All calls to backend at `http://localhost:8001`:

1. **Upload & Generate**
   ```
   POST /upload (form-data with file)
   → Returns: document_id
   
   POST /generate (JSON with document_id)
   → Returns: assessment_id, questions[]
   ```

2. **Submit Answers**
   ```
   POST /assessments/{assessment_id}/submit
   → Returns: score, max_score, percentage
   ```

3. **Analytics**
   ```
   GET /documents
   → Returns: list of documents (used for analytics)
   ```

## Styling (Tailwind Only)

- **No CSS files** - all styling is Tailwind utility classes
- **No inline styles** - no style prop objects
- **No styled-components** - pure Tailwind
- **Responsive** - mobile-first design with md: and lg: breakpoints
- **Modern UI** - matches Dribbble designs from screenshots

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes

- Timer auto-submits at 0:00
- Question palette updates in real-time
- Correct answers hidden until submission
- Confetti plays for 5 seconds on result page (score > 50%)
- All API errors show as alerts (can upgrade to toast library)
- Backend MUST be running before frontend usage
