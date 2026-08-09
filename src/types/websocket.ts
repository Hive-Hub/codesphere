export interface ServerStudentPresenceEvent {
  event: 'student_joined' | 'student_left' | 'student_online' | 'student_offline';
  session_id: number;
  student_id: number;
  name?: string;
  student_name?: string;
  roll_number?: string;
}

export interface ServerStudentCodeUpdateEvent {
  event: 'student_code_updated';
  session_id: number;
  student_id: number;
  student_name?: string;
  roll_number?: string;
  code: string;
  cursor?: {
    line: number;
    column: number;
  };
  timestamp?: string;
}

export interface ServerStudentTypingEvent {
  event: 'student_typing' | 'student_stopped_typing';
  session_id: number;
  student_id: number;
  student_name?: string;
  roll_number?: string;
  timestamp?: string;
}

export interface ServerStudentCursorEvent {
  event: 'student_cursor_updated';
  session_id: number;
  student_id: number;
  cursor: {
    line: number;
    column: number;
  };
  line?: number;
  column?: number;
  timestamp?: string;
}

export interface ServerSessionEndedEvent {
  event: 'session_ended';
  session_id: number;
  reason?: string;
}
