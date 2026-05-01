import { useRef, useState } from 'react';

export const UploadBox = ({ onFileSelected, onGenerate, loading }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const supportedFiles = [
    {
      label: selectedFile?.name || 'Drop a document here',
      subtitle: selectedFile ? 'Ready to generate' : 'PDF, DOCX, or TXT',
      tone: 'blue',
      active: true,
    },
    { label: 'lecture-notes.pdf', subtitle: '431 KB', tone: 'orange' },
    { label: 'assignment-brief.docx', subtitle: '1.2 MB', tone: 'pink' },
    { label: 'research-summary.txt', subtitle: '28 KB', tone: 'indigo' },
  ];

  const fileTypes = [
    { label: 'PDF', tone: 'red', icon: 'PDF' },
    { label: 'DOCX', tone: 'blue', icon: 'DOC' },
    { label: 'TXT', tone: 'purple', icon: 'TXT' },
  ];

  const accentStyles = {
    blue: 'from-blue-500 to-cyan-400',
    orange: 'from-orange-400 to-amber-300',
    pink: 'from-pink-500 to-fuchsia-400',
    indigo: 'from-indigo-500 to-violet-400',
    red: 'from-red-500 to-rose-400',
    purple: 'from-purple-500 to-fuchsia-400',
  };

  const iconBg = {
    blue: 'bg-blue-50 text-blue-500 border-blue-200',
    orange: 'bg-orange-50 text-orange-500 border-orange-200',
    pink: 'bg-pink-50 text-pink-500 border-pink-200',
    indigo: 'bg-indigo-50 text-indigo-500 border-indigo-200',
    red: 'bg-red-50 text-red-500 border-red-200',
    purple: 'bg-purple-50 text-purple-500 border-purple-200',
  };

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
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      alert('Only PDF, DOCX and TXT files are supported');
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

  const getFileExtension = (name) => {
    const extension = name?.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'PDF';
    if (extension === 'docx') return 'DOC';
    if (extension === 'txt') return 'TXT';
    return 'FILE';
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="rounded-[32px] bg-[#edf2ff] p-4 shadow-[0_30px_90px_rgba(79,103,255,0.18)] ring-1 ring-white/70 sm:p-5 lg:p-6">
        <div className="overflow-hidden rounded-[28px] bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f56]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#27c93f]" />
            </div>
            {selectedFile && !loading && (
              <button
                onClick={handleClear}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#ff4d4f] text-white shadow-lg transition hover:bg-[#ff6b6d]"
                aria-label="Clear selected file"
              >
                ×
              </button>
            )}
          </div>

          <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="mb-7 text-center">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-14 bg-gradient-to-r from-transparent via-[#f59e0b] to-[#f59e0b] opacity-70" />
                <h2 className="text-[1.85rem] font-extrabold tracking-[0.2em] text-[#f59e0b] sm:text-[2.1rem]">
                  UPLOAD FILES
                </h2>
                <span className="h-px w-14 bg-gradient-to-l from-transparent via-[#f59e0b] to-[#f59e0b] opacity-70" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex min-h-[470px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-[#5a8df6] bg-[#eef4ff] shadow-[0_20px_50px_rgba(90,141,246,0.15)]'
                    : selectedFile
                    ? 'border-[#d5def9] bg-[#f8faff]'
                    : 'border-[#d4dbe9] bg-[#fcfdff] hover:border-[#8db0ff] hover:bg-[#f7f9ff]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleInputChange}
                  accept=".txt,.pdf,.docx"
                  className="hidden"
                />

                <div className="mb-7 grid h-24 w-24 place-items-center rounded-full bg-[linear-gradient(180deg,rgba(90,141,246,0.18),rgba(90,141,246,0.06))] shadow-inner">
                  <svg viewBox="0 0 120 120" className="h-14 w-14 text-[#5a8df6]" fill="none" aria-hidden="true">
                    <path d="M28 78V52a10 10 0 0 1 10-10h7l7-10h16l7 10h7a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H38a10 10 0 0 1-10-10Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M60 39v30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="m50 51 10-10 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M44 83h32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
                  </svg>
                </div>

                {!selectedFile ? (
                  <>
                    <p className="text-3xl font-medium text-slate-600">Drag &amp; Drop</p>
                    <p className="mt-2 text-base text-slate-500">Your files here or browse to upload</p>
                    <p className="mt-4 text-sm font-semibold text-[#5a8df6]">
                      Only PDF, DOCX and TXT files with max size of 15 MB.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold text-slate-700">{selectedFile.name}</p>
                    <p className="mt-2 text-base text-slate-500">File ready to generate</p>
                    <div className="mt-6 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_25px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eff5ff] text-sm font-black text-[#5a8df6] ring-1 ring-[#c7d8ff]">
                          {getFileExtension(selectedFile.name)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-700">Selected document</p>
                          <p className="text-xs text-slate-500">Ready for assessment generation</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-auto pt-10">
                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    {fileTypes.map((type) => (
                      <div key={type.label} className="flex flex-col items-center gap-3">
                        <div className={`grid h-20 w-20 place-items-center rounded-2xl border ${iconBg[type.tone]} shadow-[0_10px_22px_rgba(15,23,42,0.06)]`}>
                          <span className="text-sm font-black tracking-[0.18em]">{type.icon}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex min-h-[470px] flex-col justify-between rounded-[28px] bg-[#fbfcff] px-5 py-6 ring-1 ring-slate-100 sm:px-6">
                <div className="space-y-4">
                  {supportedFiles.map((file, index) => {
                    const isSelectedFile = selectedFile && file.active;
                    const extension = file.label.includes('.')
                      ? file.label.split('.').pop().toUpperCase()
                      : index === 0
                      ? 'FILE'
                      : 'DOC';

                    return (
                      <div
                        key={`${file.label}-${index}`}
                        className={`relative rounded-2xl border bg-white px-4 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition ${
                          isSelectedFile ? 'border-[#d9e7ff] ring-2 ring-[#5a8df6]/25' : 'border-slate-100'
                        } ${index === 0 ? 'mb-2' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${iconBg[file.tone]}`}>
                            <span className="text-xs font-black tracking-[0.15em]">{extension}</span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">{file.label}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{file.subtitle}</p>
                            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                              <div className={`h-full rounded-full bg-gradient-to-r ${accentStyles[file.tone]} ${isSelectedFile ? 'w-[92%]' : index === 0 ? 'w-[76%]' : 'w-[58%]'}`} />
                            </div>
                          </div>

                          <div className={`mt-1 h-4 w-4 rounded-full border ${isSelectedFile ? 'border-emerald-500 bg-emerald-400' : 'border-sky-300 bg-white'}`} />
                        </div>

                        {isSelectedFile && (
                          <div className="absolute -right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-white shadow-lg ring-1 ring-slate-100 lg:grid lg:place-items-center">
                            <span className="text-lg text-[#5a8df6]">+</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-6 flex justify-center pt-4">
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#5a8df6] to-transparent opacity-60" />
                  <button
                    onClick={onGenerate}
                    disabled={!selectedFile || loading}
                    className="relative z-10 rounded-full bg-[#5a8df6] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(90,141,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#4f80f0] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {loading ? 'Generating...' : 'Save Files'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
