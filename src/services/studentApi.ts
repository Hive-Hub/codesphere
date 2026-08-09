import apiClient from './api';
import { ApiResponse } from '../types/api';
import { StudentJoinPayload, StudentJoinResponseData, StudentActivityEventPayload } from '../types/student';
import { Problem } from '../types/session';

export const studentApi = {
  joinSession: async (payload: StudentJoinPayload): Promise<ApiResponse<StudentJoinResponseData>> => {
    const res = await apiClient.post<ApiResponse<StudentJoinResponseData>>(
      '/student/session/join',
      payload
    );
    return res.data;
  },

  getSessionDetails: async (sessionId: number): Promise<ApiResponse<{ session: any; problem?: Problem; student: any }>> => {
    const res = await apiClient.get<ApiResponse<{ session: any; problem?: Problem; student: any }>>(
      `/student/session/${sessionId}`
    );
    return res.data;
  },

  reportActivity: async (sessionId: number, payload: StudentActivityEventPayload): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>(
      `/student/session/${sessionId}/activity`,
      payload
    );
    return res.data;
  },
};
