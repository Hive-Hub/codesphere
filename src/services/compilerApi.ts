import apiClient from './api';
import { ApiResponse } from '../types/api';
import { CodeRunPayload, CodeSavePayload, CompilerResult } from '../types/compiler';

export const compilerApi = {
  runCode: async (sessionId: number, payload: CodeRunPayload): Promise<ApiResponse<CompilerResult>> => {
    const res = await apiClient.post<ApiResponse<CompilerResult>>(
      `/student/session/${sessionId}/code/run`,
      payload
    );
    return res.data;
  },

  saveCode: async (sessionId: number, payload: CodeSavePayload): Promise<ApiResponse<{ saved: boolean; timestamp: string }>> => {
    const res = await apiClient.post<ApiResponse<{ saved: boolean; timestamp: string }>>(
      `/student/session/${sessionId}/code/save`,
      payload
    );
    return res.data;
  },
};
