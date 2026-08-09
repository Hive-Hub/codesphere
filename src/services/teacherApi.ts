import apiClient from './api';
import { ApiResponse } from '../types/api';
import { TeacherSessionCreatePayload, TeacherSessionCreateResponseData, DashboardData } from '../types/teacher';
import { Problem } from '../types/session';

export const teacherApi = {
  createSession: async (
    payload: TeacherSessionCreatePayload
  ): Promise<ApiResponse<TeacherSessionCreateResponseData>> => {
    const res = await apiClient.post<ApiResponse<TeacherSessionCreateResponseData>>(
      '/teacher/session/create',
      payload
    );
    return res.data;
  },

  getDashboard: async (sessionId: number): Promise<ApiResponse<DashboardData>> => {
    const res = await apiClient.get<ApiResponse<DashboardData>>(
      `/teacher/session/${sessionId}/dashboard`
    );
    return res.data;
  },

  getStudentDetails: async (sessionId: number, studentId: number): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>(
      `/teacher/session/${sessionId}/student/${studentId}/details`
    );
    return res.data;
  },

  setProblem: async (sessionId: number, problem: Problem): Promise<ApiResponse<Problem>> => {
    const res = await apiClient.post<ApiResponse<Problem>>(
      `/teacher/session/${sessionId}/problem`,
      problem
    );
    return res.data;
  },

  endSession: async (sessionId: number): Promise<ApiResponse<{ session_id: number; status: string }>> => {
    const res = await apiClient.post<ApiResponse<{ session_id: number; status: string }>>(
      `/teacher/session/${sessionId}/end`
    );
    return res.data;
  },
};
