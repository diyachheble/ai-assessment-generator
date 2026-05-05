import { useState } from 'react';
import { UploadBox } from '../components/UploadBox';
import { Loader } from '../components/Loader';
import { uploadAndGenerate } from '../services/api';

export const Home = ({ onAssessmentReady }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadAndGenerate(
        selectedFile,
        'mcq',
        5
      );
      onAssessmentReady(result);
    } catch (error) {
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef3ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),_rgba(255,255,255,0)_36%),radial-gradient(circle_at_20%_80%,_rgba(82,120,255,0.12),_rgba(82,120,255,0)_24%),radial-gradient(circle_at_85%_15%,_rgba(255,166,77,0.16),_rgba(255,166,77,0)_20%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#2f6ee5] to-transparent opacity-90" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        

        <div className="flex-1 pb-10">
          <div className="mx-auto max-w-6xl text-center">
            <h4 className="text-4xl font-black tracking-tight text-slate-900 ">
              AI-Based Document Assessment Generator
            </h4>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              Upload your document and get  assessment workflow in seconds.
            </p>
          </div>

          <div className="mt-10">
            {loading ? (
              <Loader message="Generating your assessment..." />
            ) : (
              <UploadBox
                onFileSelected={handleFileSelected}
                onGenerate={handleGenerate}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
