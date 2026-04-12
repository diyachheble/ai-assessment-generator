import { useEffect, useState } from 'react';
import { AnalyticsCards } from '../components/AnalyticsCards';
import { UploadBox } from '../components/UploadBox';
import { Loader } from '../components/Loader';
import { uploadAndGenerate, fetchAnalytics } from '../services/api';

export const Home = ({ onAssessmentReady }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalAssessments: 0,
    totalTestsAttempted: 0,
    averageScore: 0,
    successRate: 0,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    };

    loadAnalytics();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          AI-Based Document Assessment Generator
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Upload your document and get an instant interactive assessment
        </p>

        {/* Analytics Cards */}
        <AnalyticsCards analytics={analytics} />

        {/* Upload Box or Loader */}
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
  );
};
