import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

export const Result = ({ result, questions, answers, onStartNewAssessment }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if ((result?.percentage || 0) > 50) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const isPassed = (result?.percentage || 0) >= 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 sm:px-8 lg:px-12">
      {showConfetti && <Confetti />}

      <div className="w-full max-w-screen-lg mx-auto">
        <div className="rounded-[32px] bg-[#edf2ff] p-4 shadow-[0_30px_90px_rgba(79,103,255,0.18)] ring-1 ring-white/70 sm:p-5 lg:p-6">
          <div className="overflow-hidden rounded-[28px] bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur p-6">
            <div className="flex flex-col items-center gap-6">
              <div className="w-56 h-56 relative">
                <svg viewBox="0 0 120 120" className="w-56 h-56">
                  <defs>
                    <linearGradient id="r1" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="52" strokeWidth="12" stroke="#f1f5f9" fill="none" />
                  {(() => {
                    const pct = Math.max(0, Math.min(100, Math.round(result?.percentage || 0)));
                    const r = 52;
                    const c = 2 * Math.PI * r;
                    const dash = (pct / 100) * c;
                    return (
                      <circle
                        cx="60"
                        cy="60"
                        r={r}
                        strokeWidth="12"
                        stroke="url(#r1)"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={`${dash} ${c - dash}`}
                        transform="rotate(-90 60 60)"
                      />
                    );
                  })()}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-4xl font-bold text-slate-800">{Math.round(result?.percentage || 0)}%</div>
                  <div className="text-sm text-slate-500">Overall Score</div>
                </div>
              </div>

              {/* remove competency summary and info box as requested */}

              {/* pastel stat cards row - centered */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-3 w-full max-w-4xl">
                <div className="rounded-xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] bg-gradient-to-br from-blue-50 to-cyan-50 text-center border border-blue-100">
                  <div className="text-xs text-blue-600 font-semibold">Total Time</div>
                  <div className="text-lg font-bold text-slate-800">{result?.time || '00:00'}</div>
                </div>
                <div className="rounded-xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] bg-gradient-to-br from-indigo-50 to-blue-50 text-center border border-indigo-100">
                  <div className="text-xs text-indigo-600 font-semibold">Total Questions</div>
                  <div className="text-lg font-bold text-slate-800">{questions.length}</div>
                </div>
                <div className="rounded-xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] bg-gradient-to-br from-orange-50 to-amber-50 text-center border border-orange-100">
                  <div className="text-xs text-orange-600 font-semibold">Attempted</div>
                  <div className="text-lg font-bold text-slate-800">{Object.keys(answers).length}</div>
                </div>
                <div className="rounded-xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] bg-gradient-to-br from-emerald-50 to-green-50 text-center border border-emerald-100">
                  <div className="text-xs text-emerald-600 font-semibold">Correct</div>
                  <div className="text-lg font-bold text-slate-800">{result?.score || 0}</div>
                </div>
                <div className="rounded-xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] bg-gradient-to-br from-red-50 to-rose-50 text-center border border-red-100">
                  <div className="text-xs text-red-600 font-semibold">Unattempted</div>
                  <div className="text-lg font-bold text-slate-800">{Math.max(0, questions.length - (Object.keys(answers).length || 0))}</div>
                </div>
              </div>

              {/* actions - make both buttons same primary style */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setShowDetails((s) => !s)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-[0_18px_35px_rgba(90,141,246,0.35)] hover:scale-105 transition"
                >
                  {showDetails ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={onStartNewAssessment}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-[0_18px_35px_rgba(90,141,246,0.35)] hover:scale-105 transition"
                >
                  Start New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
        

        {/* Details toggle */}
        {showDetails && (
          <div className="mt-8 space-y-5">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.question_id];
              const isCorrect = userAnswer === q.correct_answer;

              return (
                <article key={q.question_id} className="bg-white rounded-2xl shadow-sm p-6 ring-1 ring-white/50">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-semibold">{idx + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-slate-900">{q.question_text}</h4>
                        <div className="text-xs text-slate-500">{q.difficulty || 'Basic'}</div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {q.options && q.options.map((opt) => {
                          const isUser = userAnswer === opt.key || userAnswer === opt.text;
                          return (
                            <div key={opt.key} className={`rounded-lg border px-4 py-3 ${isUser ? 'border-slate-400 bg-slate-50' : 'border-slate-100 bg-white'}`}>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">{opt.key}</div>
                                <div className="text-sm text-slate-800">{opt.text}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
