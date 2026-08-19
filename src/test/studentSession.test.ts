import { describe, it, expect, beforeEach } from 'vitest';
import { useStudentStore } from '../store/studentStore';
import { useSessionStore } from '../store/sessionStore';
import { storage } from '../utils/storage';

describe('Student Session State Management Tests', () => {
  beforeEach(() => {
    storage.clearSession();
    localStorage.clear();
    useSessionStore.getState().resetSession();
    useStudentStore.getState().clearStudent();
  });

  it('populates consolidated student store and persists to storage in setStudentData()', () => {
    const student = {
      id: 55,
      session_id: 12,
      name: 'John Doe',
      roll_number: '2023-CS-01',
      department: 'CS',
      year: '3',
      section: 'A',
      status: 'online' as const,
      progress: 0,
      code_quality: 100,
      ai_score: 100,
      executions_count: 0,
      errors_count: 0,
    };

    useStudentStore.getState().setStudentData(student, 'TOK_XYZ_123456789', 12);

    const storeState = useStudentStore.getState();
    expect(storeState.studentId).toBe(55);
    expect(storeState.sessionId).toBe(12);
    expect(storeState.studentName).toBe('John Doe');
    expect(storeState.studentToken).toBe('TOK_XYZ_123456789');

    // Storage persistence check
    expect(storage.getStudentId()).toBe(55);
    expect(storage.getSessionId()).toBe(12);
    expect(storage.getStudentToken()).toBe('TOK_XYZ_123456789');
  });

  it('clears all student store state on clearStudent()', () => {
    const student = {
      id: 55,
      session_id: 12,
      name: 'John Doe',
      roll_number: '2023-CS-01',
      department: 'CS',
      year: '3',
      section: 'A',
      status: 'online' as const,
      progress: 0,
      code_quality: 100,
      ai_score: 100,
      executions_count: 0,
      errors_count: 0,
    };

    useStudentStore.getState().setStudentData(student, 'TOK_XYZ_123456789', 12);
    useStudentStore.getState().clearStudent();

    const storeState = useStudentStore.getState();
    expect(storeState.studentId).toBeNull();
    expect(storeState.studentToken).toBeNull();
    expect(storeState.studentName).toBeNull();
  });

  it('manages draftAvailable state cleanly', () => {
    const draftCode = 'def main():\n    print("draft")';
    useStudentStore.getState().setDraftAvailable(true, draftCode);

    const state = useStudentStore.getState();
    expect(state.draftAvailable).toBe(true);
    expect(state.draftCode).toBe(draftCode);

    useStudentStore.getState().setDraftAvailable(false, null);
    expect(useStudentStore.getState().draftAvailable).toBe(false);
    expect(useStudentStore.getState().draftCode).toBeNull();
  });
});
