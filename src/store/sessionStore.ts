import { create } from 'zustand';
import { Session, Problem } from '../types/session';
import { storage } from '../utils/storage';

interface SessionState {
  activeRole: 'teacher' | 'student' | null;
  session: Session | null;
  problem: Problem | null;
  sessionEnded: boolean;
  endedReason: string | null;
  secondsRemaining: number;
  
  setActiveRole: (role: 'teacher' | 'student' | null) => void;
  setSession: (session: Session | null) => void;
  setProblem: (problem: Problem | null) => void;
  setSessionEnded: (ended: boolean, reason?: string) => void;
  setSecondsRemaining: (seconds: number) => void;
  decrementTimer: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeRole: storage.getActiveRole(),
  session: null,
  problem: null,
  sessionEnded: false,
  endedReason: null,
  secondsRemaining: 86400, // default 24h limit

  setActiveRole: (role) => {
    if (role) storage.setActiveRole(role);
    set({ activeRole: role });
  },

  setSession: (session) => set({ session }),

  setProblem: (problem) => set({ problem }),

  setSessionEnded: (ended, reason = 'Teacher ended session') => set({
    sessionEnded: ended,
    endedReason: reason,
  }),

  setSecondsRemaining: (seconds) => set({ secondsRemaining: seconds }),

  decrementTimer: () => set((state) => ({
    secondsRemaining: Math.max(0, state.secondsRemaining - 1),
  })),

  resetSession: () => {
    storage.clearSession();
    set({
      activeRole: null,
      session: null,
      problem: null,
      sessionEnded: false,
      endedReason: null,
      secondsRemaining: 86400,
    });
  },
}));
