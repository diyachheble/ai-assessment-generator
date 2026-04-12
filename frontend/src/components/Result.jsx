import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

export const Result = ({ result, questions, answers, onStartNewAssessment }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (result.percentage > 50) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [result.percentage]);

  const isPassed = result.percentage >= 50;

  // Create a mapping of question_id to correct answer
  const questionMap = questions.reduce((acc, q) => {
    acc[q.question_id] = q;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {showConfetti && <Confetti />}

      <div className="max-w-2xl mx-auto">
        {/* Score Badge */}
        <div className="flex justify-center mb-12">
          <div
            className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg ${
              isPassed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-white">
                {Math.round(result.score)}/{Math.round(result.max_score)}
              </div>
            </div>
          </div>
        </div>

        {/* Percentage and Status */}
        <div className="text-center mb-12">
          <p className="text-4xl font-bold text-gray-900 mb-4">{Math.round(result.percentage)}%</p>
          <div className="inline-block">
            <span
              className={`px-6 py-2 rounded-full font-bold text-white ${
                isPassed ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isPassed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Answer Review</h2>

          <div className="space-y-6">
            {questions.map((question) => {
              const userAnswer = answers[question.question_id];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <div key={question.question_id} className="border-l-4 border-gray-300 pl-6 py-4">
                  <p className="font-semibold text-gray-900 mb-3">
                    Q{question.question_id}: {question.question_text}
                  </p>

                  <div className="space-y-2">
                    <p className={`text-sm font-semibold ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Your Answer: {userAnswer || 'Not answered'}
                      {isCorrect && ' ✓'}
                      {!isCorrect && userAnswer && ' ✗'}
                    </p>

                    {!isCorrect && (
                      <p className="text-sm font-semibold text-green-600">
                        Correct Answer: {question.correct_answer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start New Button */}
        <button
          onClick={onStartNewAssessment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};
