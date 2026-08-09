import { create } from 'zustand';
import { Student } from '../types/student';
import { storage } from '../utils/storage';

interface StudentState {
  student: Student | null;
  studentToken: string | null;
  warningMessage: string | null;
  
  setStudentData: (student: Student, token: string) => void;
  setWarningMessage: (message: string | null) => void;
  clearStudent: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  student: storage.getSessionInfo()?.student || null,
  studentToken: storage.getStudentToken(),
  warningMessage: null,

  setStudentData: (student, token) => {
    storage.setStudentToken(token);
    set({ student, studentToken: token });
  },

  setWarningMessage: (message) => set({ warningMessage: message }),

  clearStudent: () => set({ student: null, studentToken: null, warningMessage: null }),
}));
