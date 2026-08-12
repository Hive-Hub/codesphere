import apiClient from './api';
import { ApiResponse } from '../types/api';
import { TeacherSessionCreatePayload, TeacherSessionCreateResponseData, DashboardData } from '../types/teacher';
import { Problem } from '../types/session';
import { storage } from '../utils/storage';
import { teacherAuthStore } from '../store/teacherAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export interface TeacherProfilePayload {
  name: string;
  email: string;
  college?: string;
  department?: string;
  subject?: string;
}

export interface PersistentStats {
  total_students: number;
  students_today: number;
  total_sessions: number;
  sessions_today: number;
  active_sessions: number;
  completed_sessions: number;
}

export interface StudentHistoryRecord {
  student_id: number;
  name: string;
  roll_number: string;
  department: string;
  year: string;
  section: string;
  total_sessions: number;
  avg_score: number;
  avg_ai_score: number;
  avg_progress: number;
  avg_code_quality: number;
  compiler_runs: number;
  successful_runs: number;
  failed_runs: number;
  first_session: string | null;
  last_session: string | null;
  sessions: Array<{
    session_id: number;
    date: string;
    session_title: string;
    language: string;
    problem: string;
    progress: number;
    score: number;
    ai_score: number;
    code_quality?: number;
    result: string;
  }>;
}

export const teacherApi = {
  initProfile: async (payload: TeacherProfilePayload): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/teacher/profile', payload);
    if (res.data?.data?.teacher_token) {
      teacherAuthStore.setToken(res.data.data.teacher_token);
      if (res.data.data.teacher) {
        teacherAuthStore.setProfile(res.data.data.teacher);
      }
    }
    return res.data;
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/teacher/profile');
    return res.data;
  },

  getDashboardStats: async (): Promise<ApiResponse<PersistentStats>> => {
    const res = await apiClient.get<ApiResponse<PersistentStats>>('/teacher/dashboard/stats');
    return res.data;
  },

  getSessionsList: async (): Promise<ApiResponse<{ sessions: any[]; total: number }>> => {
    const res = await apiClient.get<ApiResponse<{ sessions: any[]; total: number }>>('/teacher/sessions');
    return res.data;
  },

  searchStudents: async (queryStr: string = ''): Promise<ApiResponse<{ students: StudentHistoryRecord[]; total: number }>> => {
    const res = await apiClient.get<ApiResponse<{ students: StudentHistoryRecord[]; total: number }>>('/teacher/students', {
      params: { q: queryStr }
    });
    return res.data;
  },

  getStudentHistory: async (studentId: number): Promise<ApiResponse<StudentHistoryRecord>> => {
    const res = await apiClient.get<ApiResponse<StudentHistoryRecord>>(`/teacher/students/${studentId}/history`);
    return res.data;
  },

  createSession: async (
    payload: TeacherSessionCreatePayload
  ): Promise<ApiResponse<TeacherSessionCreateResponseData>> => {
    try {
      const res = await apiClient.post<ApiResponse<TeacherSessionCreateResponseData>>(
        '/teacher/session/create',
        payload
      );
      if (res.data?.data?.teacher_token) {
        storage.setTeacherToken(res.data.data.teacher_token);
      }
      if (res.data?.data?.profile_token) {
        teacherAuthStore.setToken(res.data.data.profile_token);
      }
      return res.data;
    } catch (axiosErr) {
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
    const res = await apiClient.get<ApiResponse<DashboardData>>(`/teacher/session/${sessionId}/dashboard`);
    return res.data;
  },

  setProblem: async (sessionId: number, problem: Problem): Promise<ApiResponse<Problem>> => {
    const res = await apiClient.post<ApiResponse<Problem>>(`/teacher/session/${sessionId}/problem`, problem);
    return res.data;
  },

  getStudentDetails: async (sessionId: number, studentId: number): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>(`/teacher/session/${sessionId}/students/${studentId}/code`);
    return res.data;
  },

  endSession: async (sessionId: number): Promise<ApiResponse<{ session_id: number; status: string }>> => {
    const res = await apiClient.post<ApiResponse<{ session_id: number; status: string }>>(`/teacher/session/${sessionId}/end`);
    return res.data;
  },
};
