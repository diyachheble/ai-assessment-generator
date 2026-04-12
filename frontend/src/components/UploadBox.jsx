import { useRef, useState } from 'react';

export const UploadBox = ({ onFileSelected, onGenerate, loading }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      alert('Only PDF and DOCX files are supported');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 relative">
      {/* Close button */}
      {selectedFile && !loading && (
        <button
          onClick={handleClear}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-600 hover:bg-red-300 transition"
        >
          ✕
        </button>
      )}

      {/* Title */}
      <h2 className="text-center text-2xl font-bold text-orange-500 mb-8">
        ━━━ UPLOAD FILES ━━━
      </h2>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          accept=".pdf,.docx"
          className="hidden"
        />

        {!selectedFile ? (
          <>
            <div className="text-5xl mb-4">📄</div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">Drag & Drop</p>
            <p className="text-gray-600 mb-1">Your files here or browse to upload</p>
            <p className="text-sm text-gray-400">Only PDF and DOCX files with max size of 15 MB</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">✓</div>
            <p className="text-lg font-semibold text-green-600">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mt-2">File ready to generate</p>
          </>
        )}
      </div>

      {/* File Type Icons */}
      <div className="flex justify-center gap-8 mt-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center text-2xl mb-2">
            🔴
          </div>
          <p className="text-sm font-semibold text-gray-700">PDF</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-2xl mb-2">
            📘
          </div>
          <p className="text-sm font-semibold text-gray-700">DOCX</p>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!selectedFile || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 disabled:scale-100"
      >
        {loading ? 'Generating...' : 'GENERATE ASSESSMENT'}
      </button>
    </div>
  );
};
