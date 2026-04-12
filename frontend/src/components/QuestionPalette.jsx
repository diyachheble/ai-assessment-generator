export const QuestionPalette = ({ questions, currentIndex, answers, onJumpToQuestion }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Question Palette</h3>

      <div className="grid grid-cols-6 gap-2 mb-6">
        {questions.map((question, idx) => {
          let bgColor = 'bg-gray-100';
          if (answers[question.question_id]) {
            bgColor = 'bg-green-500';
          } else if (idx < currentIndex) {
            bgColor = 'bg-orange-500';
          }

          const borderColor = idx === currentIndex ? 'border-2 border-blue-500' : '';

          return (
            <button
              key={question.question_id}
              onClick={() => onJumpToQuestion(idx)}
              className={`w-10 h-10 rounded-lg font-semibold text-white transition ${bgColor} ${borderColor} hover:opacity-80`}
            >
              {question.question_id}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="text-xs space-y-1 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-600">Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-blue-500"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-100"></div>
          <span className="text-gray-600">Not Visited</span>
        </div>
      </div>
    </div>
  );
};
