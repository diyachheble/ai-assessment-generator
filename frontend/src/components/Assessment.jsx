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
    <div className="min-h-screen bg-white flex flex-col">
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
        <div className="flex-1 lg:flex-[3] p-8 lg:p-12 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
              🕐 {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question */}
          <div className="mb-10">
            <div className="inline-block w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6">
              {currentIndex + 1}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-8">{currentQuestion.question_text}</h2>

            {/* Options */}
            <div className="space-y-4">
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

          {/* Bottom Navigation Bar - Fixed */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={handleClearResponse}
              className="text-gray-600 hover:text-gray-900 font-semibold transition"
            >
              Clear Response
            </button>

            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={terminated}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
            >
              Submit Assessment
            </button>
          </div>
        </div>

        {/* Right Column - Question Palette */}
        <div className="hidden lg:block w-1/4 bg-gray-50 p-8 border-l border-gray-200 overflow-y-auto">
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
