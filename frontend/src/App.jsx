import { useState } from 'react';
import { Assessment } from '../src/components/Assessment';
import { Result } from '../src/components/Result';
import { submitAnswers } from '../src/services/api';
import { Home } from './pages/Home';

export const AppComponent = () => {
  const [page, setPage] = useState('home'); // 'home', 'assessment', 'result'
  const [assessmentData, setAssessmentData] = useState(null);
  const [result, setResult] = useState(null);

  const handleAssessmentReady = (data) => {
    setAssessmentData(data);
    setPage('assessment');
  };

  const handleSubmitAssessment = async (assessmentId, answers) => {
    try {
      const submitResult = await submitAnswers(assessmentId, answers);
      
      // Enhance result with question details and correct answers for display
      const enhancedResult = {
        ...submitResult,
        answers: answers.reduce((acc, item) => {
          acc[item.question_id] = item.answer;
          return acc;
        }, {}),
      };
      
      setResult(enhancedResult);
      setPage('result');
    } catch (error) {
      alert(`Error submitting assessment: ${error.message}`);
    }
  };

  const handleStartNewAssessment = () => {
    setPage('home');
    setAssessmentData(null);
    setResult(null);
  };

  if (page === 'home') {
    return <Home onAssessmentReady={handleAssessmentReady} />;
  }

  if (page === 'assessment' && assessmentData) {
    return (
      <Assessment
        questions={assessmentData.questions}
        assessmentId={assessmentData.assessment_id}
        onSubmit={handleSubmitAssessment}
        title={`Assessment - ${assessmentData.assessment_type.toUpperCase()}`}
      />
    );
  }

  if (page === 'result' && result && assessmentData) {
    return (
      <Result
        result={result}
        questions={assessmentData.questions}
        answers={result.answers || {}}
        onStartNewAssessment={handleStartNewAssessment}
      />
    );
  }

  return null;
};

export default AppComponent;
