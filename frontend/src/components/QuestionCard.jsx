export const QuestionCard = ({ option, selected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(option.key)}
      className={`w-full p-4 border-2 rounded-lg cursor-pointer transition ${
        selected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center">
        <div
          className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
            selected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-400 bg-white'
          }`}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
        <span className="text-gray-800">{option.text}</span>
      </div>
    </div>
  );
};
