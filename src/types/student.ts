export type StudentPresenceStatus = 'online' | 'offline' | 'typing' | 'running';

export interface Student {
  id: number;
  session_id: number;
  name: string;
  roll_number: string;
  department: string;
  year: string;
  section: string;
  status: StudentPresenceStatus;
  joined_at?: string;
  last_active?: string;
  is_typing?: boolean;
  progress?: number;
  code_quality?: number;
  ai_score?: number;
  executions_count?: number;
  errors_count?: number;
  current_stage?: string;
  is_stuck?: boolean;
  current_code?: string;
  cursor_line?: number;
  cursor_column?: number;
}

export interface StudentJoinPayload {
  session_code: string;
  name: string;
  roll_number: string;
  department: string;
  year: string;
  section: string;
}

export interface StudentJoinResponseData {
  student_token: string;
  student: Student;
  session: {
    session_id: number;
    session_code: string;
    mode: 'practice' | 'problem_solving';
    language: 'python' | 'c' | 'java';
    title: string;
    college: string;
    department: string;
    subject: string;
  };
}

export interface StudentActivityEventPayload {
  activity_type: 'copy' | 'paste' | 'cut' | 'tab_blur' | 'tab_focus';
  details?: string;
}
