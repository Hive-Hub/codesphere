import apiClient from './api';
import { ApiResponse } from '../types/api';
import { CodeRunPayload, CodeSavePayload, CompilerResult } from '../types/compiler';
import { storage } from '../utils/storage';

export const compilerApi = {
  runCode: async (sessionId: number, payload: CodeRunPayload): Promise<ApiResponse<CompilerResult>> => {
    // Ensure student active role is set for Bearer token interceptor
    storage.setActiveRole('student');

    const formattedPayload = {
      language: payload.language.toLowerCase().trim() as 'python' | 'c' | 'java',
      code: payload.code,
      stdin: payload.stdin || '',
    };

    const res = await apiClient.post<ApiResponse<CompilerResult>>(
      `/student/session/${sessionId}/code/run`,
      formattedPayload
    );

    return res.data;
  },

  saveCode: async (sessionId: number, payload: CodeSavePayload): Promise<ApiResponse<{ version?: number; saved_at?: string; saved?: boolean; timestamp?: string }>> => {
    storage.setActiveRole('student');

    const formattedPayload = {
      language: payload.language.toLowerCase().trim() as 'python' | 'c' | 'java',
      code: payload.code,
    };

    const res = await apiClient.post<ApiResponse<{ version?: number; saved_at?: string; saved?: boolean; timestamp?: string }>>(
      `/student/session/${sessionId}/code/save`,
      formattedPayload
    );

    return res.data;
  },
};
