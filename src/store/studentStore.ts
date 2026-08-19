import { create } from 'zustand';
import { Student } from '../types/student';
import { storage } from '../utils/storage';

interface StudentState {
  // Core session identity — single source of truth
  student: Student | null;
  studentToken: string | null;
  sessionId: number | null;
  studentId: number | null;
  sessionCode: string | null;
  studentName: string | null;
  rollNumber: string | null;

  // UI state
  warningMessage: string | null;
  draftAvailable: boolean;
  draftCode: string | null;

  // Actions
  setStudentData: (student: Student, token: string, sessionId: number) => void;
  setWarningMessage: (message: string | null) => void;
  setDraftAvailable: (available: boolean, code?: string | null) => void;
  clearStudent: () => void;
}

export const useStudentStore = create<StudentState>((set) => {
  // Initialize from storage
  const sessionInfo = storage.getSessionInfo<any>();
  const storedStudent = sessionInfo?.student || null;
  const storedToken = storage.getStudentToken();
  const storedSessionId = storage.getSessionId();
  const storedStudentId = storage.getStudentId();

  return {
    student: storedStudent,
    studentToken: storedToken,
    sessionId: storedSessionId,
    studentId: storedStudentId,
    sessionCode: sessionInfo?.session?.session_code || null,
    studentName: storedStudent?.name || null,
    rollNumber: storedStudent?.roll_number || null,
    warningMessage: null,
    draftAvailable: false,
    draftCode: null,

    setStudentData: (student, token, sessionId) => {
      // Persist to storage
      storage.setStudentToken(token);
      storage.setStudentId(student.id);
      storage.setSessionId(sessionId);
      storage.setSessionInfo({ student, session: { id: sessionId }, student_token: token });

      set({
        student,
        studentToken: token,
        sessionId,
        studentId: student.id,
        studentName: student.name,
        rollNumber: student.roll_number,
      });
    },

    setWarningMessage: (message) => set({ warningMessage: message }),

    setDraftAvailable: (available, code = null) => set({
      draftAvailable: available,
      draftCode: code,
    }),

    clearStudent: () => set({
      student: null,
      studentToken: null,
      sessionId: null,
      studentId: null,
      sessionCode: null,
      studentName: null,
      rollNumber: null,
      warningMessage: null,
      draftAvailable: false,
      draftCode: null,
    }),
  };
});
