import { create } from 'zustand';
import { CompilerResult, CompilerState } from '../types/compiler';

interface EditorState {
  code: string;
  language: 'python' | 'c' | 'java';
  stdin: string;
  isSaving: boolean;
  lastSavedAt: string | null;
  isRunning: boolean;
  compilerResult: CompilerResult | null;
  compilerState: CompilerState;
  activeConsoleTab: 'output' | 'input' | 'errors';

  // V2.1: Code versioning to prevent stale overwrites
  codeVersion: number;
  lastSyncedVersion: number;

  setCode: (code: string) => void;
  setLanguage: (lang: 'python' | 'c' | 'java') => void;
  setStdin: (stdin: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSavedAt: (timestamp: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setCompilerResult: (result: CompilerResult | null) => void;
  setCompilerState: (state: CompilerState) => void;
  setActiveConsoleTab: (tab: 'output' | 'input' | 'errors') => void;
  incrementCodeVersion: () => number;
  setLastSyncedVersion: (version: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  code: '',
  language: 'python',
  stdin: '',
  isSaving: false,
  lastSavedAt: null,
  isRunning: false,
  compilerResult: null,
  compilerState: 'idle',
  activeConsoleTab: 'output',
  codeVersion: 0,
  lastSyncedVersion: 0,

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setStdin: (stdin) => set({ stdin }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),
  setIsRunning: (isRunning) => set({ isRunning }),

  setCompilerResult: (compilerResult) => set({
    compilerResult,
    activeConsoleTab: compilerResult?.stderr ? 'errors' : 'output',
  }),

  setCompilerState: (compilerState) => set({ compilerState }),

  setActiveConsoleTab: (activeConsoleTab) => set({ activeConsoleTab }),

  incrementCodeVersion: () => {
    const nextVersion = get().codeVersion + 1;
    set({ codeVersion: nextVersion });
    return nextVersion;
  },

  setLastSyncedVersion: (version) => set({ lastSyncedVersion: version }),
}));
