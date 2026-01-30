import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 120000, 
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiError>) => {
        // Handle standard error structures here if needed
        // e.g. logging 500 errors, or extracting error messages

        if (error.response) {
            // Server responded with a status code outside 2xx range
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // request was made but no response
            console.error('Network Error:', error.message);
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
