import apiClient from './api';
import { ApiResponse } from '../types/api';
import { ReportStatusResponse, ReportSummaryResponse } from '../types/report';

export const reportApi = {
  getStatus: async (sessionId: number): Promise<ApiResponse<ReportStatusResponse>> => {
    const res = await apiClient.get<ApiResponse<ReportStatusResponse>>(
      `/teacher/session/${sessionId}/report/status`
    );
    return res.data;
  },

  getSummary: async (sessionId: number): Promise<ApiResponse<ReportSummaryResponse>> => {
    const res = await apiClient.get<ApiResponse<ReportSummaryResponse>>(
      `/teacher/session/${sessionId}/report/summary`
    );
    return res.data;
  },

  retryReport: async (sessionId: number): Promise<ApiResponse<{ message: string; status: string }>> => {
    const res = await apiClient.post<ApiResponse<{ message: string; status: string }>>(
      `/teacher/session/${sessionId}/report/retry`
    );
    return res.data;
  },

  downloadPdf: async (sessionId: number, sessionCode: string = 'report'): Promise<void> => {
    const response = await apiClient.get(`/teacher/session/${sessionId}/report/pdf`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codesphere_session_${sessionCode}_report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  downloadExcel: async (sessionId: number, sessionCode: string = 'report'): Promise<void> => {
    const response = await apiClient.get(`/teacher/session/${sessionId}/report/excel`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codesphere_session_${sessionCode}_report.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
