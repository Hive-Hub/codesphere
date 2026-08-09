import apiClient from './api';
import { ApiResponse } from '../types/api';
import { StudentJoinPayload, StudentJoinResponseData, StudentActivityEventPayload } from '../types/student';
import { Problem } from '../types/session';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export const studentApi = {
  joinSession: async (payload: StudentJoinPayload): Promise<ApiResponse<StudentJoinResponseData>> => {
    try {
      const res = await apiClient.post<ApiResponse<StudentJoinResponseData>>(
        '/student/session/join',
        payload
      );
      return res.data;
    } catch (axiosErr) {
      console.warn('[studentApi.joinSession] Axios error, using native fetch fallback...', axiosErr);
      const response = await fetch(`${API_BASE_URL}/student/session/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    }
  },

  getSessionDetails: async (sessionId: number): Promise<ApiResponse<{ session: any; problem?: Problem; student: any }>> => {
    try {
      const res = await apiClient.get<ApiResponse<{ session: any; problem?: Problem; student: any }>>(
        `/student/session/${sessionId}`
      );
      return res.data;
    } catch (axiosErr) {
      const token = storage.getStudentToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/student/session/${sessionId}`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      return data;
    }
  },

  reportActivity: async (sessionId: number, payload: StudentActivityEventPayload): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>(
        `/student/session/${sessionId}/activity`,
        payload
      );
      return res.data;
    } catch (axiosErr) {
      const token = storage.getStudentToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/student/session/${sessionId}/activity`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    }
  },
};
