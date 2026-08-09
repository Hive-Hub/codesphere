export interface ClientStudentJoinEvent {
  session_id: number;
  student_id: number;
  name: string;
}

export interface ClientTeacherJoinEvent {
  session_id: number;
}

export interface ClientCodeChangeEvent {
  session_id: number;
  student_id: number;
  code: string;
}

export interface ClientTypingEvent {
  session_id: number;
  student_id: number;
}

export interface ClientCursorChangeEvent {
  session_id: number;
  student_id: number;
  line: number;
  column: number;
}

export interface ServerStudentPresenceEvent {
  event: 'student_joined' | 'student_left' | 'student_online' | 'student_offline';
  session_id: number;
  student_id: number;
  name?: string;
  roll_number?: string;
  timestamp?: string;
}

export interface ServerStudentCodeUpdateEvent {
  event: 'student_code_updated';
  session_id: number;
  student_id: number;
  code: string;
  timestamp?: string;
}

export interface ServerStudentTypingEvent {
  event: 'student_typing' | 'student_stopped_typing';
  session_id: number;
  student_id: number;
}

export interface ServerStudentCursorEvent {
  event: 'student_cursor_updated';
  session_id: number;
  student_id: number;
  line: number;
  column: number;
}

export interface ServerCompilerEvent {
  event: 'compiler_started' | 'compiler_completed';
  session_id: number;
  student_id: number;
  status?: string;
  result?: any;
}

export interface ServerAIEvent {
  event: 'ai_analysis_started' | 'ai_analysis_completed' | 'ai_progress_updated';
  session_id: number;
  student_id: number;
  progress?: number;
  summary?: any;
}

export interface ServerSessionEndedEvent {
  event: 'session_ended';
  session_id: number;
  reason: 'teacher_ended' | '24_hour_expired' | string;
}

export interface LiveActivityFeedItem {
  id: string;
  timestamp: string;
  student_name?: string;
  student_id?: number;
  event_type: string;
  message: string;
  category: 'presence' | 'code' | 'compiler' | 'ai' | 'session';
}
