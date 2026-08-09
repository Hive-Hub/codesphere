import axios from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
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

export default apiClient;
