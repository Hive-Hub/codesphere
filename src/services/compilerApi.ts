import apiClient from './api';
import { ApiResponse } from '../types/api';
import { CodeRunPayload, CodeSavePayload, CompilerResult } from '../types/compiler';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export const compilerApi = {
  runCode: async (sessionId: number, payload: CodeRunPayload): Promise<ApiResponse<CompilerResult>> => {
    const formattedPayload = {
      language: payload.language.toLowerCase().trim() as 'python' | 'c' | 'java',
      code: payload.code,
      stdin: payload.stdin || '',
    };

    try {
      const res = await apiClient.post<ApiResponse<CompilerResult>>(
        `/student/session/${sessionId}/code/run`,
        formattedPayload
      );
      return res.data;
    } catch (axiosErr) {
      console.warn('[compilerApi.runCode] Axios request failed, trying fetch fallback...', axiosErr);
      const token = storage.getStudentToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/student/session/${sessionId}/code/run`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedPayload),
      });
      const data = await response.json();
      return data;
    }
  },

  saveCode: async (sessionId: number, payload: CodeSavePayload): Promise<ApiResponse<{ version?: number; saved_at?: string; saved?: boolean; timestamp?: string }>> => {
    const formattedPayload = {
      language: payload.language.toLowerCase().trim() as 'python' | 'c' | 'java',
      code: payload.code,
    };

    try {
      const res = await apiClient.post<ApiResponse<{ version?: number; saved_at?: string; saved?: boolean; timestamp?: string }>>(
        `/student/session/${sessionId}/code/save`,
        formattedPayload
      );
      return res.data;
    } catch (axiosErr) {
      const token = storage.getStudentToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/student/session/${sessionId}/code/save`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedPayload),
      });
      const data = await response.json();
      return data;
    }
  },

  getExecutions: async (sessionId: number): Promise<ApiResponse<{ executions: CompilerResult[] }>> => {
    const res = await apiClient.get<ApiResponse<{ executions: CompilerResult[] }>>(`/student/session/${sessionId}/executions`);
    return res.data;
  }
};
