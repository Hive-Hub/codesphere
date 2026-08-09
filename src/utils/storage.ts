const TEACHER_TOKEN_KEY = 'codesphere_teacher_token';
const STUDENT_TOKEN_KEY = 'codesphere_student_token';
const SESSION_ID_KEY = 'codesphere_session_id';
const STUDENT_ID_KEY = 'codesphere_student_id';
const ACTIVE_ROLE_KEY = 'codesphere_active_role';
const SESSION_INFO_KEY = 'codesphere_session_info';
const CODE_DRAFT_PREFIX = 'codesphere_code_draft_';

const sanitizeToken = (val: string | null): string | null => {
  if (!val || val === 'undefined' || val === 'null' || val.trim().length < 10) {
    return null;
  }
  return val.trim();
};

export const storage = {
  // Teacher Token
  getTeacherToken: (): string | null => {
    return sanitizeToken(sessionStorage.getItem(TEACHER_TOKEN_KEY));
  },
  setTeacherToken: (token: string): void => {
    if (token && token !== 'undefined' && token !== 'null') {
      sessionStorage.setItem(TEACHER_TOKEN_KEY, token);
    }
  },

  // Student Token
  getStudentToken: (): string | null => {
    return sanitizeToken(sessionStorage.getItem(STUDENT_TOKEN_KEY));
  },
  setStudentToken: (token: string): void => {
    if (token && token !== 'undefined' && token !== 'null') {
      sessionStorage.setItem(STUDENT_TOKEN_KEY, token);
    }
  },

  // Session ID
  getSessionId: (): number | null => {
    const val = sessionStorage.getItem(SESSION_ID_KEY);
    return val && val !== 'undefined' && val !== 'null' ? parseInt(val, 10) : null;
  },
  setSessionId: (id: number): void => {
    if (id) {
      sessionStorage.setItem(SESSION_ID_KEY, id.toString());
    }
  },

  // Student ID
  getStudentId: (): number | null => {
    const val = sessionStorage.getItem(STUDENT_ID_KEY);
    return val && val !== 'undefined' && val !== 'null' ? parseInt(val, 10) : null;
  },
  setStudentId: (id: number): void => {
    if (id) {
      sessionStorage.setItem(STUDENT_ID_KEY, id.toString());
    }
  },

  // Active Role ('teacher' | 'student')
  getActiveRole: (): 'teacher' | 'student' | null => {
    const val = sessionStorage.getItem(ACTIVE_ROLE_KEY);
    return val === 'teacher' || val === 'student' ? val : null;
  },
  setActiveRole: (role: 'teacher' | 'student'): void => {
    sessionStorage.setItem(ACTIVE_ROLE_KEY, role);
  },

  // Session Info
  getSessionInfo: <T = any>(): T | null => {
    const data = sessionStorage.getItem(SESSION_INFO_KEY);
    if (!data || data === 'undefined' || data === 'null') return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },
  setSessionInfo: (info: any): void => {
    if (info) {
      sessionStorage.setItem(SESSION_INFO_KEY, JSON.stringify(info));
    }
  },

  // Local Offline Code Backup (localStorage so network drops don't wipe code)
  getCodeDraft: (sessionId: number, studentId: number): string | null => {
    return localStorage.getItem(`${CODE_DRAFT_PREFIX}${sessionId}_${studentId}`);
  },
  setCodeDraft: (sessionId: number, studentId: number, code: string): void => {
    localStorage.setItem(`${CODE_DRAFT_PREFIX}${sessionId}_${studentId}`, code);
  },

  // Clear all session tokens
  clearSession: (): void => {
    sessionStorage.removeItem(TEACHER_TOKEN_KEY);
    sessionStorage.removeItem(STUDENT_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(STUDENT_ID_KEY);
    sessionStorage.removeItem(ACTIVE_ROLE_KEY);
    sessionStorage.removeItem(SESSION_INFO_KEY);
  },
};
