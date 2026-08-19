import { create } from 'zustand';
import { Session, Problem } from '../types/session';
import { SocketConnectionState } from '../types/websocket';
import { storage } from '../utils/storage';

export type WorkspaceStatus = 'IDLE' | 'CONNECTING' | 'JOINING' | 'LOADING' | 'READY' | 'ERROR' | 'ENDED';
export type NetworkStatus = 'ONLINE' | 'OFFLINE';

interface SessionState {
  activeRole: 'teacher' | 'student' | null;
  session: Session | null;
  problem: Problem | null;
  sessionEnded: boolean;
  endedReason: string | null;
  secondsRemaining: number;

  // V2.1 additions: connection & workspace state
  socketStatus: SocketConnectionState;
  networkStatus: NetworkStatus;
  workspaceStatus: WorkspaceStatus;

  setActiveRole: (role: 'teacher' | 'student' | null) => void;
  setSession: (session: Session | null) => void;
  setProblem: (problem: Problem | null) => void;
  setSessionEnded: (ended: boolean, reason?: string) => void;
  setSecondsRemaining: (seconds: number) => void;
  decrementTimer: () => void;
  setSocketStatus: (status: SocketConnectionState) => void;
  setNetworkStatus: (status: NetworkStatus) => void;
  setWorkspaceStatus: (status: WorkspaceStatus) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeRole: storage.getActiveRole(),
  session: null,
  problem: null,
  sessionEnded: false,
  endedReason: null,
  secondsRemaining: 86400, // default 24h limit

  // V2.1
  socketStatus: 'DISCONNECTED',
  networkStatus: 'ONLINE',
  workspaceStatus: 'IDLE',

  setActiveRole: (role) => {
    if (role) storage.setActiveRole(role);
    set({ activeRole: role });
  },

  setSession: (session) => set({ session }),

  setProblem: (problem) => set({ problem }),

  setSessionEnded: (ended, reason = 'Teacher ended session') => set({
    sessionEnded: ended,
    endedReason: reason,
    workspaceStatus: ended ? 'ENDED' : undefined,
  } as any),

  setSecondsRemaining: (seconds) => set({ secondsRemaining: seconds }),

  decrementTimer: () => set((state) => ({
    secondsRemaining: Math.max(0, state.secondsRemaining - 1),
  })),

  setSocketStatus: (socketStatus) => set({ socketStatus }),

  setNetworkStatus: (networkStatus) => set({ networkStatus }),

  setWorkspaceStatus: (workspaceStatus) => set({ workspaceStatus }),

  resetSession: () => {
    storage.clearSession();
    set({
      activeRole: null,
      session: null,
      problem: null,
      sessionEnded: false,
      endedReason: null,
      secondsRemaining: 86400,
      socketStatus: 'DISCONNECTED',
      networkStatus: 'ONLINE',
      workspaceStatus: 'IDLE',
    });
  },
}));
