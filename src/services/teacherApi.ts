import apiClient from './api';
import { ApiResponse } from '../types/api';
import { TeacherSessionCreatePayload, TeacherSessionCreateResponseData, DashboardData } from '../types/teacher';
import { Problem } from '../types/session';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export const teacherApi = {
  createSession: async (
    payload: TeacherSessionCreatePayload
  ): Promise<ApiResponse<TeacherSessionCreateResponseData>> => {
    try {
      const res = await apiClient.post<ApiResponse<TeacherSessionCreateResponseData>>(
        '/teacher/session/create',
        payload
      );
      return res.data;
    } catch (axiosErr) {
      console.warn('[teacherApi.createSession] Axios error, using native fetch fallback...', axiosErr);
      const response = await fetch(`${API_BASE_URL}/teacher/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    }
  },

  getDashboard: async (sessionId: number): Promise<ApiResponse<DashboardData>> => {
    try {
      const res = await apiClient.get<ApiResponse<DashboardData>>(
        `/teacher/session/${sessionId}/dashboard`
      );
      return res.data;
    } catch (axiosErr) {
      console.warn('[teacherApi.getDashboard] Axios error, using native fetch fallback...', axiosErr);
      const token = storage.getTeacherToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/teacher/session/${sessionId}/dashboard`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      return data;
    }
  },

  getStudentDetails: async (sessionId: number, studentId: number): Promise<ApiResponse<any>> => {
    try {
      const res = await apiClient.get<ApiResponse<any>>(
        `/teacher/session/${sessionId}/student/${studentId}/details`
      );
      return res.data;
    } catch (axiosErr) {
      const token = storage.getTeacherToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/teacher/session/${sessionId}/student/${studentId}/details`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      return data;
    }
  },

  setProblem: async (sessionId: number, problem: Problem): Promise<ApiResponse<Problem>> => {
    try {
      const res = await apiClient.post<ApiResponse<Problem>>(
        `/teacher/session/${sessionId}/problem`,
        problem
      );
      return res.data;
    } catch (axiosErr) {
      const token = storage.getTeacherToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/teacher/session/${sessionId}/problem`, {
        method: 'POST',
        headers,
        body: JSON.stringify(problem),
      });
      const data = await response.json();
      return data;
    }
  },

  endSession: async (sessionId: number): Promise<ApiResponse<{ session_id: number; status: string }>> => {
    try {
      const res = await apiClient.post<ApiResponse<{ session_id: number; status: string }>>(
        `/teacher/session/${sessionId}/end`
      );
      return res.data;
    } catch (axiosErr) {
      const token = storage.getTeacherToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/teacher/session/${sessionId}/end`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      return data;
    }
  },
};
