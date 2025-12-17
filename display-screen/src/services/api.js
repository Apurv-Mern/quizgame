/**
 * API Service
 * Centralized Axios instance for API calls
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        // Add any auth tokens or custom headers here if needed
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

export default apiClient;
