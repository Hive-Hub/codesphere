import apiClient from './api';
import { ApiResponse } from '../types/api';
import {
  AIExplainErrorRequest,
  AIHintRequest,
  AIReviewRequest,
  AIResponse,
  ClassAIOverview,
} from '../types/ai';

export const aiApi = {
  explainError: async (sessionId: number, payload: AIExplainErrorRequest): Promise<ApiResponse<AIResponse>> => {
    const res = await apiClient.post<ApiResponse<AIResponse>>(
      `/ai/student/session/${sessionId}/ai/explain-error`,
      payload
    );
    return res.data;
  },

  getHint: async (sessionId: number, payload: AIHintRequest): Promise<ApiResponse<AIResponse>> => {
    const res = await apiClient.post<ApiResponse<AIResponse>>(
      `/ai/student/session/${sessionId}/ai/hint`,
      payload
    );
    return res.data;
  },

  reviewCode: async (sessionId: number, payload: AIReviewRequest): Promise<ApiResponse<AIResponse>> => {
    const res = await apiClient.post<ApiResponse<AIResponse>>(
      `/ai/student/session/${sessionId}/ai/review`,
      payload
    );
    return res.data;
  },

  getTeacherOverview: async (sessionId: number): Promise<ApiResponse<ClassAIOverview>> => {
    const res = await apiClient.get<ApiResponse<ClassAIOverview>>(
      `/teacher/session/${sessionId}/ai/overview`
    );
    return res.data;
  },
};
