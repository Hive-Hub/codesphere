import axios, { AxiosError } from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds to support Render free tier cold starts
});

// Request Interceptor: Attach bearer token dynamically depending on active role
apiClient.interceptors.request.use(
  (config) => {
    const activeRole = storage.getActiveRole();
    if (activeRole === 'teacher') {
      const teacherToken = storage.getTeacherToken();
      if (teacherToken) {
        config.headers.Authorization = `Bearer ${teacherToken}`;
      }
    } else if (activeRole === 'student') {
      const studentToken = storage.getStudentToken();
      if (studentToken) {
        config.headers.Authorization = `Bearer ${studentToken}`;
      }
    } else {
      // Fallback: Check if teacher token exists first, then student token
      const tToken = storage.getTeacherToken();
      const sToken = storage.getStudentToken();
      if (tToken) {
        config.headers.Authorization = `Bearer ${tToken}`;
      } else if (sToken) {
        config.headers.Authorization = `Bearer ${sToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-retry once on Render cold start Network Error / 502 / 503 / 504
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;

    if (!config || config._retryCount >= 2) {
      return Promise.reject(error);
    }

    const isNetworkOrColdStart =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      [502, 503, 504].includes(error.response?.status || 0);

    if (isNetworkOrColdStart) {
      config._retryCount = (config._retryCount || 0) + 1;
      console.warn(`[Axios Cold Start Retry] Attempt ${config._retryCount} for ${config.url}`);
      
      // Wait 2 seconds before retrying to let Render finish waking up
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
