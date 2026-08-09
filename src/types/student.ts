import { Session } from './session';

export type StudentPresenceStatus = 'online' | 'offline' | 'typing';

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
  progress?: number;
  code_quality?: number;
  ai_score?: number;
  executions_count?: number;
  errors_count?: number;
  code?: string;
  current_code?: string;
  cursor_line?: number;
  cursor_column?: number;
  is_typing?: boolean;
  is_stuck?: boolean;
  last_execution_status?: string;
  last_output?: string;
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
  session: Session;
}

export interface StudentActivityEventPayload {
  activity_type: string;
  details?: any;
}
