export const Loader = ({ message = 'Generating your assessment...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
      </div>
      <p className="text-lg text-gray-500 font-medium">{message}</p>
    </div>
  );
};
