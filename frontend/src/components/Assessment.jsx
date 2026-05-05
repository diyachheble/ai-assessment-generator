import { useEffect, useState } from 'react';
import { QuestionCard } from './QuestionCard';
import { QuestionPalette } from './QuestionPalette';
import { useProctoring } from '../hooks/useProctoring';

export const Assessment = ({
  questions,
  assessmentId,
  onSubmit,
  title = 'Assessment',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const { violations, warningMessage, terminated } = useProctoring(true);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];

  const handleSelectAnswer = (optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question_id]: optionKey,
    }));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleJump = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.question_id];
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    const answerList = questions.map((q) => ({
      question_id: q.question_id,
      answer: answers[q.question_id] || null,
    }));
    onSubmit(assessmentId, answerList);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Warning Banner */}
      {warningMessage && (
        <div className={`w-full py-3 px-4 text-center font-semibold ${
          terminated ? 'bg-red-600 text-white' : 'bg-yellow-400 text-gray-900'
        }`}>
          {warningMessage}
        </div>
      )}

      <div className="flex flex-1">
        {/* Left Column - Question */}
        <div className="flex-1 lg:flex-[3] px-8 lg:px-16 py-10 lg:py-12 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">{title}</h1>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg ring-1 ring-white/50">
              <span className="text-sm font-semibold text-slate-600">Time Left</span>
              <span className="text-2xl font-bold text-indigo-600 font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-12 bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-lg ring-1 ring-white/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg">
                {currentIndex + 1}
              </div>
              <div className="text-sm font-semibold text-slate-600">Question {currentIndex + 1} of {questions.length}</div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-relaxed">{currentQuestion.question_text}</h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options && currentQuestion.options.map((option) => (
                <QuestionCard
                  key={option.key}
                  option={option}
                  selected={answers[currentQuestion.question_id] === option.key}
                  onSelect={handleSelectAnswer}
                />
              ))}
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="mt-12 pt-10 border-t-2 border-white/50 flex justify-between items-center">
            <button
              onClick={handleClearResponse}
              className="text-slate-600 hover:text-slate-900 font-semibold transition hover:bg-white/50 px-4 py-2 rounded-lg"
            >
              Clear Response
            </button>

            <div className="flex gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:border-slate-400 hover:bg-white/50 disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:border-slate-400 hover:bg-white/50 disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
              >
                Next →
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={terminated}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Submit Assessment
            </button>
          </div>
        </div>

        {/* Right Column - Question Palette */}
        <div className="hidden lg:flex lg:w-1/4 bg-white/40 backdrop-blur-xl p-8 border-l border-white/50 overflow-y-auto flex-col">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            onJumpToQuestion={handleJump}
          />
        </div>
      </div>
    </div>
  );
};
