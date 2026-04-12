# Assessment Generator Frontend

Modern React + Tailwind CSS frontend for the AI-Based Document Assessment Generator.

## Tech Stack

- React 18
- Tailwind CSS
- Axios
- react-confetti
- Vite (dev server)

## Installation

```bash
# Install dependencies
npm install

# Start dev server on http://localhost:3000
npm run dev

# Build for production
npm build
```

## Features

1. **Upload Page (Home.jsx)**
   - Drag & drop file upload
   - Analytics cards showing assessment stats
   - Real-time file type validation
   - Responsive design

2. **Assessment Page (Assessment.jsx)**
   - Interactive MCQ questions
   - 10-minute countdown timer
   - Question palette with progress tracking
   - Real-time question navigation
   - Proctoring features:
     - Disable right-click
     - Detect copy-paste attempts
     - Detect tab switching (terminate after 3 violations)

3. **Result Page (Result.jsx)**
   - Score display with pass/fail badge
   - Confetti animation for passing scores
   - Full answer review with correct answers
   - Start new assessment button

## API Endpoints (Backend at localhost:8001)

- `POST /upload` - Upload document
- `POST /generate` - Generate assessment
- `POST /assessments/{id}/submit` - Submit answers
- `GET /documents` - Get analytics

## Project Structure

```
src/
  components/       - Reusable React components
  pages/           - Full page components
  services/        - API integration
  hooks/           - Custom React hooks
  App.jsx          - Main app component
  main.jsx         - Entry point
  index.css        - Tailwind CSS config
```

## Notes

- All styling uses Tailwind CSS utility classes only
- No inline styles or style tags
- Fully responsive on mobile, tablet, and desktop
- Assessment page uses proctoring to prevent cheating
- Results are calculated and displayed in real-time
