export type SessionLanguage = 'python' | 'c' | 'java';
export type SessionMode = 'practice' | 'problem_solving';
export type SessionStatus = 'active' | 'ended' | 'expired';

export interface Session {
  id: number;
  session_code: string;
  teacher_name: string;
  teacher_email: string;
  college: string;
  department: string;
  subject: string;
  title: string;
  language: SessionLanguage;
  mode: SessionMode;
  status: SessionStatus;
  created_at?: string;
  ended_at?: string;
  expires_at?: string;
}

export interface SessionStatusCheck {
  session_code: string;
  status: SessionStatus;
  is_active: boolean;
  language: SessionLanguage;
  mode: SessionMode;
  title: string;
  teacher_name: string;
  college?: string;
  department?: string;
  subject?: string;
}

export interface Problem {
  id?: number;
  session_id?: number;
  title: string;
  description: string;
  constraints?: string;
  input_format?: string;
  output_format?: string;
  sample_input?: string;
  sample_output?: string;
  reference_solution?: string;
  created_at?: string;
}
