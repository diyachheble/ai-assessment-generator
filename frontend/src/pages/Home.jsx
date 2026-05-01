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
        <div className="mb-6 flex items-center justify-end">
          <div className="hidden items-center gap-3 rounded-2xl bg-gradient-to-r from-[#6b7cff] to-[#84b3ff] px-5 py-3 text-white shadow-[0_16px_40px_rgba(83,110,255,0.35)] sm:flex">
            <span className="rounded-md bg-black/20 px-2 py-1 text-xs font-bold tracking-[0.2em]">XD</span>
            <span className="text-sm font-semibold tracking-[0.35em]">FREEBIE</span>
            <span className="text-lg">⬇</span>
          </div>
        </div>

        <div className="flex-1 pb-10">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              AI-Based Document Assessment Generator
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              Upload your document and get a beautifully styled assessment workflow in seconds.
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
