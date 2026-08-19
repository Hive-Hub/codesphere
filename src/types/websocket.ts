export type SocketConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'FAILED';

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
  version?: number;
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

export interface ServerCompilerStartedEvent {
  event: 'compiler_started';
  session_id: number;
  student_id: number;
  language: string;
  timestamp?: string;
}

export interface ServerCompilerCompletedEvent {
  event: 'compiler_completed';
  session_id: number;
  student_id: number;
  status: string;
  exit_code?: number;
  stdout?: string;
  stderr?: string;
  execution_time?: string | number;
  timestamp?: string;
}
