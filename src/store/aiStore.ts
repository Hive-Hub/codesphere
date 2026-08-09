import { create } from 'zustand';
import { AIResponse, ClassAIOverview } from '../types/ai';

interface AIState {
  aiResponse: AIResponse | null;
  isLoadingAI: boolean;
  aiMode: 'explain' | 'hint' | 'review' | null;
  teacherOverview: ClassAIOverview | null;
  isLoadingOverview: boolean;
  
  setAIResponse: (response: AIResponse | null, mode?: 'explain' | 'hint' | 'review' | null) => void;
  setLoadingAI: (loading: boolean) => void;
  setTeacherOverview: (overview: ClassAIOverview | null) => void;
  setLoadingOverview: (loading: boolean) => void;
  clearAI: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  aiResponse: null,
  isLoadingAI: false,
  aiMode: null,
  teacherOverview: null,
  isLoadingOverview: false,

  setAIResponse: (aiResponse, mode = null) => set({ aiResponse, aiMode: mode }),
  setLoadingAI: (isLoadingAI) => set({ isLoadingAI }),
  setTeacherOverview: (teacherOverview) => set({ teacherOverview }),
  setLoadingOverview: (isLoadingOverview) => set({ isLoadingOverview }),
  clearAI: () => set({ aiResponse: null, isLoadingAI: false, aiMode: null }),
}));
