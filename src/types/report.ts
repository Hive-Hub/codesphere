export type ReportGenerationStatus = 'pending' | 'generating' | 'ready' | 'failed';

export interface ReportStatusResponse {
  status: ReportGenerationStatus;
  progress?: number;
  pdf_available: boolean;
  excel_available: boolean;
  pdf_url?: string;
  excel_url?: string;
  generated_at?: string;
  error_message?: string;
}

export interface ReportSummaryResponse {
  session_id: number;
  session_code: string;
  title: string;
  teacher_name: string;
  language: string;
  mode: string;
  total_students: number;
  avg_progress: number;
  avg_code_quality: number;
  completed_at?: string;
  top_performers?: { name: string; roll_number: string; progress: number }[];
}
