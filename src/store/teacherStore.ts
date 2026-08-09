import { create } from 'zustand';
import { DashboardMetrics } from '../types/teacher';
import { Student } from '../types/student';
import { LiveActivityFeedItem } from '../types/websocket';

interface TeacherState {
  metrics: DashboardMetrics;
  students: Student[];
  selectedStudent: Student | null;
  activityFeed: LiveActivityFeedItem[];
  isLoadingDashboard: boolean;
  
  setDashboardData: (metrics: DashboardMetrics, students: Student[]) => void;
  updateStudentPresence: (studentId: number, status: 'online' | 'offline' | 'typing' | 'running', name?: string, roll_number?: string) => void;
  updateStudentCode: (studentId: number, code: string) => void;
  updateStudentTyping: (studentId: number, isTyping: boolean) => void;
  updateStudentCursor: (studentId: number, line: number, column: number) => void;
  setSelectedStudent: (student: Student | null) => void;
  addActivityItem: (item: LiveActivityFeedItem) => void;
  setLoadingDashboard: (loading: boolean) => void;
}

const initialMetrics: DashboardMetrics = {
  total_students: 0,
  online_students: 0,
  offline_students: 0,
  avg_progress: 0,
  avg_ai_score: 0,
  total_executions: 0,
  successful_executions: 0,
  failed_executions: 0,
};

export const useTeacherStore = create<TeacherState>((set) => ({
  metrics: initialMetrics,
  students: [],
  selectedStudent: null,
  activityFeed: [],
  isLoadingDashboard: false,

  setDashboardData: (incomingMetrics, students) => set((state) => {
    const list = students || [];
    const mergedMetrics: DashboardMetrics = {
      total_students: incomingMetrics?.total_students ?? list.length ?? 0,
      online_students: incomingMetrics?.online_students ?? list.filter(s => s.status === 'online').length ?? 0,
      offline_students: incomingMetrics?.offline_students ?? list.filter(s => s.status === 'offline').length ?? 0,
      avg_progress: incomingMetrics?.avg_progress ?? 0,
      avg_ai_score: incomingMetrics?.avg_ai_score ?? 100,
      total_executions: incomingMetrics?.total_executions ?? incomingMetrics?.total_code_runs ?? 0,
      successful_executions: incomingMetrics?.successful_executions ?? incomingMetrics?.successful_runs ?? 0,
      failed_executions: incomingMetrics?.failed_executions ?? incomingMetrics?.failed_runs ?? 0,
    };
    return { metrics: mergedMetrics, students: list };
  }),

  updateStudentPresence: (studentId, status, name, roll_number) => set((state) => {
    let studentExists = false;
    const updatedStudents = state.students.map((st) => {
      if (st.id === studentId) {
        studentExists = true;
        return { ...st, status, is_typing: status === 'offline' ? false : st.is_typing };
      }
      return st;
    });

    if (!studentExists && (status === 'online' || status === 'typing')) {
      const newStudent: Student = {
        id: studentId,
        session_id: 0,
        name: name || `Student ${studentId}`,
        roll_number: roll_number || 'N/A',
        department: 'CS',
        year: 'N/A',
        section: 'A',
        status: status,
        progress: 0,
        code_quality: 100,
        ai_score: 100,
        executions_count: 0,
        errors_count: 0,
      };
      updatedStudents.push(newStudent);
    }

    const onlineCount = updatedStudents.filter((s) => s.status === 'online' || s.status === 'typing').length;
    const offlineCount = updatedStudents.length - onlineCount;

    return {
      students: updatedStudents,
      metrics: {
        ...state.metrics,
        total_students: updatedStudents.length,
        online_students: onlineCount,
        offline_students: offlineCount,
      },
      selectedStudent: state.selectedStudent?.id === studentId
        ? { ...state.selectedStudent, status }
        : state.selectedStudent,
    };
  }),

  updateStudentCode: (studentId, code) => set((state) => ({
    students: state.students.map((st) =>
      st.id === studentId ? { ...st, current_code: code } : st
    ),
    selectedStudent: state.selectedStudent?.id === studentId
      ? { ...state.selectedStudent, current_code: code }
      : state.selectedStudent,
  })),

  updateStudentTyping: (studentId, isTyping) => set((state) => ({
    students: state.students.map((st) =>
      st.id === studentId ? { ...st, is_typing: isTyping } : st
    ),
    selectedStudent: state.selectedStudent?.id === studentId
      ? { ...state.selectedStudent, is_typing: isTyping }
      : state.selectedStudent,
  })),

  updateStudentCursor: (studentId, line, column) => set((state) => ({
    students: state.students.map((st) =>
      st.id === studentId ? { ...st, cursor_line: line, cursor_column: column } : st
    ),
    selectedStudent: state.selectedStudent?.id === studentId
      ? { ...state.selectedStudent, cursor_line: line, cursor_column: column }
      : state.selectedStudent,
  })),

  setSelectedStudent: (student) => set({ selectedStudent: student }),

  addActivityItem: (item) => set((state) => ({
    activityFeed: [item, ...state.activityFeed].slice(0, 100), // Keep latest 100 events
  })),

  setLoadingDashboard: (loading) => set({ isLoadingDashboard: loading }),
}));
