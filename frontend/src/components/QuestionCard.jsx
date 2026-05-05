export const QuestionCard = ({ option, selected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(option.key)}
      className={`w-full p-5 rounded-2xl cursor-pointer transition transform hover:scale-102 ring-1 ${
        selected
          ? 'bg-gradient-to-r from-blue-100 to-indigo-100 ring-2 ring-blue-400 shadow-md'
          : 'bg-white/60 ring-slate-200 hover:ring-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
            selected
              ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md'
              : 'border-slate-400 bg-white hover:border-slate-500'
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
        </div>
        <span className={`text-base font-medium transition ${ selected ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>{option.text}</span>
      </div>
    </div>
  );
};
