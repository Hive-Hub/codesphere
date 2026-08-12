import apiClient from './api';
import { ApiResponse } from '../types/api';
import { ReportStatusResponse, ReportSummaryResponse } from '../types/report';

export interface GenerateReportPayload {
  filter_type: 'today' | 'monthly' | 'custom' | 'session' | 'student';
  month?: string;
  start_date?: string;
  end_date?: string;
  session_id?: number;
  student_id?: number;
  format?: 'pdf' | 'excel' | 'both';
}

export interface ReportJobData {
  id: number;
  job_id: string;
  filter_type: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  error_message?: string;
  has_pdf: boolean;
  has_excel: boolean;
  downloads: {
    pdf: string | null;
    excel: string | null;
  };
  created_at: string;
  completed_at?: string;
}

export const reportApi = {
  getStatus: async (sessionId: number): Promise<ApiResponse<ReportStatusResponse>> => {
    const res = await apiClient.get<ApiResponse<ReportStatusResponse>>(`/teacher/session/${sessionId}/report/status`);
    return res.data;
  },

  getSummary: async (sessionId: number): Promise<ApiResponse<ReportSummaryResponse>> => {
    const res = await apiClient.get<ApiResponse<ReportSummaryResponse>>(`/teacher/session/${sessionId}/report/summary`);
    return res.data;
  },

  retryReport: async (sessionId: number): Promise<ApiResponse<{ message: string; status: string }>> => {
    const res = await apiClient.post<ApiResponse<{ message: string; status: string }>>(`/teacher/session/${sessionId}/report/retry`);
    return res.data;
  },

  downloadPdf: async (sessionId: number, sessionCode: string = 'report'): Promise<void> => {
    const response = await apiClient.get(`/teacher/session/${sessionId}/report/pdf`, { responseType: 'blob' });
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
    const response = await apiClient.get(`/teacher/session/${sessionId}/report/excel`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codesphere_session_${sessionCode}_report.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // V2 Any-Time Report Generator Methods
  generateReportV2: async (payload: GenerateReportPayload): Promise<ApiResponse<ReportJobData>> => {
    const res = await apiClient.post<ApiResponse<ReportJobData>>('/teacher/reports/generate', payload);
    return res.data;
  },

  getJobStatusV2: async (jobId: string): Promise<ApiResponse<ReportJobData>> => {
    const res = await apiClient.get<ApiResponse<ReportJobData>>(`/teacher/reports/job/${jobId}/status`);
    return res.data;
  },

  downloadJobReportV2: async (jobId: string, format: 'pdf' | 'excel'): Promise<void> => {
    const response = await apiClient.get(`/teacher/reports/download/${jobId}?format=${format}`, { responseType: 'blob' });
    const contentType = format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf';
    const ext = format === 'excel' ? 'xlsx' : 'pdf';

    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codesphere_report_${jobId.slice(0, 8)}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  getReportHistoryV2: async (): Promise<ApiResponse<{ reports: ReportJobData[] }>> => {
    const res = await apiClient.get<ApiResponse<{ reports: ReportJobData[] }>>('/teacher/reports/history');
    return res.data;
  }
};
