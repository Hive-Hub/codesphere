import { Session, Problem } from './session';
import { Student } from './student';

export interface TeacherSessionCreatePayload {
  teacher_name: string;
  teacher_email: string;
  college: string;
  department: string;
  subject: string;
  title: string;
  language: 'python' | 'c' | 'java';
  mode: 'practice' | 'problem_solving';
}

export interface TeacherSessionCreateResponseData {
  teacher_token: string;
  profile_token?: string;
  session: Session;
}

export interface DashboardMetrics {
  total_students?: number;
  online_students?: number;
  offline_students?: number;
  typing_students?: number;
  idle_students?: number;
  running_students?: number;
  submitted_students?: number;
  avg_progress?: number;
  avg_ai_score?: number;
  total_executions?: number;
  successful_executions?: number;
  failed_executions?: number;
  total_code_runs?: number;
  successful_runs?: number;
  failed_runs?: number;
  total_activity_events?: number;
}

export interface DashboardData {
  session: Session;
  problem?: Problem | null;
  metrics?: DashboardMetrics;
  statistics?: DashboardMetrics;
  students: Student[];
}
