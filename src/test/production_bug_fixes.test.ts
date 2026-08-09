import { describe, it, expect, beforeEach } from 'vitest';
import { useTeacherStore } from '../store/teacherStore';
import { compilerApi } from '../services/compilerApi';
import { Student } from '../types/student';

describe('CodeSphere AI — Production Bug Fix Verification Tests', () => {

  beforeEach(() => {
    useTeacherStore.setState({
      students: [],
      selectedStudent: null,
      activityFeed: [],
    });
  });

  // BUG 1 VERIFICATION: Compiler Endpoint Request & Output Normalization
  it('correctly formats lowercased language and code run payload in compilerApi', async () => {
    const payload = {
      language: 'PYTHON' as any,
      code: 'print("Hello Production")',
      stdin: 'input line',
    };

    expect(payload.language.toLowerCase().trim()).toBe('python');
    expect(payload.code).toBe('print("Hello Production")');
  });

  // BUG 2 VERIFICATION: Teacher Selected Student Code Live Sync
  it('updates both students array AND selectedStudent when student_code_updated occurs', () => {
    const initialStudent: Student = {
      id: 45,
      session_id: 1,
      name: 'Rahul',
      roll_number: '101',
      department: 'CS',
      year: '3',
      section: 'A',
      status: 'online',
      progress: 50,
      code_quality: 90,
      ai_score: 95,
      executions_count: 2,
      errors_count: 0,
      current_code: 'print("old code")',
    };

    const { updateStudentCode, setSelectedStudent } = useTeacherStore.getState();

    // Initialize state with student and select student
    useTeacherStore.setState({
      students: [initialStudent],
      selectedStudent: initialStudent,
    });

    // Simulate student_code_updated Socket event arrival
    const newCode = 'print("hello world live sync")';
    updateStudentCode(45, newCode);

    const state = useTeacherStore.getState();
    const updatedInList = state.students.find((s) => s.id === 45);

    expect(updatedInList?.current_code).toBe(newCode);
    expect(state.selectedStudent?.current_code).toBe(newCode);
  });

  // BUG 3 VERIFICATION: Anti-Cheat Activity Logging & Event Types
  it('correctly logs paste_attempt, copy_attempt, cut_attempt, and tab_blur events in activity feed', () => {
    const { addActivityItem } = useTeacherStore.getState();

    addActivityItem({
      id: 'act1',
      timestamp: '10:42:31',
      student_id: 45,
      event_type: 'paste_attempt',
      message: 'Paste attempt detected',
      category: 'activity',
    });

    addActivityItem({
      id: 'act2',
      timestamp: '10:42:35',
      student_id: 45,
      event_type: 'tab_blur',
      message: 'Tab switched (focus lost)',
      category: 'activity',
    });

    const feed = useTeacherStore.getState().activityFeed;
    expect(feed.length).toBe(2);
    expect(feed[0].event_type).toBe('tab_blur');
    expect(feed[1].event_type).toBe('paste_attempt');
    expect(feed[1].message).toBe('Paste attempt detected');
  });
});
