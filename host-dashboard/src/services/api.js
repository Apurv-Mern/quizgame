/**
 * API Service
 * Centralized Axios instance for API calls in host-dashboard
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://interactivequiz-webapp-backend.24livehost.com:3015';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add timestamp for cache busting if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.error || error.message;
        console.error('API Error:', errorMessage);
        return Promise.reject(error);
    }
);

/**
 * Game status API
 */
export const gameAPI = {
    /**
     * Get game status
     */
    async getGameStatus() {
        try {
            const response = await apiClient.get('/api/game/status');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get game status');
        }
    },

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await apiClient.get('/health');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Health check failed');
        }
    },
};

/**
 * Questions API
 */
export const questionsAPI = {
    /**
     * Save questions to backend
     */
    async saveQuestions(questions) {
        try {
            const response = await apiClient.post('/api/questions', { questions });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to save questions');
        }
    },

    /**
     * Load questions from backend
     */
    async loadQuestions() {
        try {
            const response = await apiClient.get('/api/questions');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to load questions');
        }
    },
};

export default apiClient;
