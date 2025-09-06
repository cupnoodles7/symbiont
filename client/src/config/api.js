// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // Node.js server endpoints
    SEARCH: `${API_BASE_URL}/search`,
    NUTRITION: `${API_BASE_URL}/nutrition`,
    GEMINI_CHAT: `${API_BASE_URL}/api/gemini/chat`,
    HEALTH_TASKS: `${API_BASE_URL}/api/gemini/health-tasks`,
    BARCODE: `${API_BASE_URL}/barcode`,
    PROCESS_IMAGE: `${API_BASE_URL}/process-image`,

    // Python server endpoints (if you have a separate Python server)
    ANALYZE_ACTIVITY: `${PYTHON_API_URL}/analyze-activity`,
    MOTION_DETECTION: `${PYTHON_API_URL}`,
    WORKOUT_ANALYZER: `${PYTHON_API_URL}`
};

export { API_BASE_URL, PYTHON_API_URL };
