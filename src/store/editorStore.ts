import { create } from 'zustand';
import { CompilerResult } from '../types/compiler';

interface EditorState {
  code: string;
  language: 'python' | 'c' | 'java';
  stdin: string;
  isSaving: boolean;
  lastSavedAt: string | null;
  isRunning: boolean;
  compilerResult: CompilerResult | null;
  activeConsoleTab: 'output' | 'input' | 'errors';
  
  setCode: (code: string) => void;
  setLanguage: (lang: 'python' | 'c' | 'java') => void;
  setStdin: (stdin: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSavedAt: (timestamp: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setCompilerResult: (result: CompilerResult | null) => void;
  setActiveConsoleTab: (tab: 'output' | 'input' | 'errors') => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: '',
  language: 'python',
  stdin: '',
  isSaving: false,
  lastSavedAt: null,
  isRunning: false,
  compilerResult: null,
  activeConsoleTab: 'output',

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
  setActiveConsoleTab: (activeConsoleTab) => set({ activeConsoleTab }),
}));
