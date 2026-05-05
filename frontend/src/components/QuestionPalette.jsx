export const QuestionPalette = ({ questions, currentIndex, answers, onJumpToQuestion }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">Question Palette</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((question, idx) => {
            let bgColor = 'bg-slate-100 text-slate-600';
            let ringColor = 'ring-slate-300';
            if (answers[question.question_id]) {
              bgColor = 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md';
              ringColor = 'ring-green-400';
            } else if (idx < currentIndex) {
              bgColor = 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md';
              ringColor = 'ring-orange-400';
            }

            const borderColor = idx === currentIndex ? `ring-2 ring-blue-500 ${ringColor}` : `ring-1 ${ringColor}`;

            return (
              <button
                key={question.question_id}
                onClick={() => onJumpToQuestion(idx)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition transform hover:scale-110 ${bgColor} ${borderColor} hover:shadow-lg`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-auto pt-6 border-t border-white/50">
        <div className="text-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm"></div>
            <span className="text-slate-700 font-medium">Answered</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-lg bg-slate-200 shadow-sm"></div>
            <span className="text-slate-700 font-medium">Not Visited</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-lg border-2 border-blue-500"></div>
            <span className="text-slate-700 font-medium">Current</span>
          </div>
        </div>
      </div>
    </div>
  );
};
