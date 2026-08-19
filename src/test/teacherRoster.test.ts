import { describe, it, expect, beforeEach } from 'vitest';
import { useTeacherStore } from '../store/teacherStore';
import { Student } from '../types/student';

describe('Teacher Roster & REST/Socket Reconciliation Unit Tests', () => {
  beforeEach(() => {
    useTeacherStore.setState({
      students: [],
      selectedStudent: null,
      activityFeed: [],
      metrics: {
        total_students: 0,
        online_students: 0,
        offline_students: 0,
        avg_progress: 0,
        avg_ai_score: 100,
        total_executions: 0,
        successful_executions: 0,
        failed_executions: 0,
      },
    });
  });

  it('adds new online student dynamically on updateStudentPresence if not in list', () => {
    const { updateStudentPresence } = useTeacherStore.getState();

    updateStudentPresence(101, 'online', 'Alice Smith', 'ROLL-101');

    const state = useTeacherStore.getState();
    expect(state.students.length).toBe(1);
    expect(state.students[0].name).toBe('Alice Smith');
    expect(state.students[0].status).toBe('online');
    expect(state.metrics.total_students).toBe(1);
    expect(state.metrics.online_students).toBe(1);
  });

  it('updates existing student presence without creating duplicate entries', () => {
    const { updateStudentPresence } = useTeacherStore.getState();

    updateStudentPresence(101, 'online', 'Alice Smith', 'ROLL-101');
    updateStudentPresence(101, 'typing');
    updateStudentPresence(101, 'offline');

    const state = useTeacherStore.getState();
    expect(state.students.length).toBe(1);
    expect(state.students[0].status).toBe('offline');
    expect(state.metrics.online_students).toBe(0);
    expect(state.metrics.offline_students).toBe(1);
  });

  it('reconciles REST students with live socket state without dropping live typing/cursor state', () => {
    const { updateStudentPresence, updateStudentTyping, updateStudentCursor, reconcileStudents } = useTeacherStore.getState();

    // 1. Initial socket presence + typing + cursor
    updateStudentPresence(101, 'online', 'Alice Smith', 'ROLL-101');
    updateStudentTyping(101, true);
    updateStudentCursor(101, 15, 8);

    // 2. REST update arrives from backend
    const restStudents: Student[] = [
      {
        id: 101,
        session_id: 1,
        name: 'Alice Smith',
        roll_number: 'ROLL-101',
        department: 'CS',
        year: '3',
        section: 'A',
        status: 'online',
        progress: 75,
        code_quality: 95,
        ai_score: 98,
        executions_count: 5,
        errors_count: 1,
      },
      {
        id: 102,
        session_id: 1,
        name: 'Bob Johnson',
        roll_number: 'ROLL-102',
        department: 'CS',
        year: '3',
        section: 'B',
        status: 'offline',
        progress: 20,
        code_quality: 80,
        ai_score: 85,
        executions_count: 1,
        errors_count: 0,
      },
    ];

    reconcileStudents(restStudents);

    const state = useTeacherStore.getState();
    expect(state.students.length).toBe(2);

    const alice = state.students.find((s) => s.id === 101);
    expect(alice?.progress).toBe(75); // Updated from REST
    expect(alice?.is_typing).toBe(true); // Preserved from Socket
    expect(alice?.cursor_line).toBe(15); // Preserved from Socket
    expect(alice?.cursor_column).toBe(8); // Preserved from Socket
  });

  it('deduplicates activity items by event_type and timestamp', () => {
    const { addActivityItem } = useTeacherStore.getState();

    const timestamp = '12:00:00';
    addActivityItem({
      id: 'item1',
      timestamp,
      student_id: 101,
      event_type: 'tab_blur',
      message: 'Tab switched',
      category: 'activity',
    });

    // Duplicate attempt
    addActivityItem({
      id: 'item2',
      timestamp,
      student_id: 101,
      event_type: 'tab_blur',
      message: 'Tab switched',
      category: 'activity',
    });

    const feed = useTeacherStore.getState().activityFeed;
    expect(feed.length).toBe(1);
  });
});
