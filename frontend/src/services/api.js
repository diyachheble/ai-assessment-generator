import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadAndGenerate = async (file, assessmentType = 'mcq', numQuestions = 5) => {
  try {
    // Step 1: Upload file
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    const uploadResponse = await api.post('/upload', uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const { document_id } = uploadResponse.data;
    
    // Step 2: Generate assessment
    const generateResponse = await api.post('/generate', {
      document_id,
      assessment_type: assessmentType,
      num_questions: numQuestions,
    });
    
    return {
      assessment_id: generateResponse.data.assessment_id,
      document_id: generateResponse.data.document_id,
      questions: generateResponse.data.questions,
      assessment_type: generateResponse.data.assessment_type,
    };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to upload and generate assessment');
  }
};

export const submitAnswers = async (assessmentId, answers) => {
  try {
    const response = await api.post(`/assessments/${assessmentId}/submit`, {
      answers,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to submit assessment');
  }
};

export const fetchAnalytics = async () => {
  try {
    const response = await api.get('/documents');
    return {
      totalAssessments: response.data.length || 0,
      totalTestsAttempted: 0,
      averageScore: 0,
      successRate: 0,
    };
  } catch (error) {
    return {
      totalAssessments: 0,
      totalTestsAttempted: 0,
      averageScore: 0,
      successRate: 0,
    };
  }
};

export default api;
