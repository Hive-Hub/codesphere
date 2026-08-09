import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../utils/storage';
import { parseApiError } from '../utils/errors';
import { apiClient } from '../services/api';
import { useSessionStore } from '../store/sessionStore';
import { useTeacherStore } from '../store/teacherStore';
import { useEditorStore } from '../store/editorStore';

describe('CodeSphere AI — Security, Tokens & Error Handling Tests', () => {

  beforeEach(() => {
    storage.clearSession();
    localStorage.clear();
    useSessionStore.getState().resetSession();
  });

  // 1. Token Separation Security Tests
  it('enforces strict token separation for Teacher and Student roles', () => {
    storage.setTeacherToken('TEACHER_SECRET_TOKEN_123');
    storage.setStudentToken('STUDENT_SECRET_TOKEN_456');

    // Set Teacher role
    storage.setActiveRole('teacher');
    expect(storage.getActiveRole()).toBe('teacher');
    expect(storage.getTeacherToken()).toBe('TEACHER_SECRET_TOKEN_123');

    // Set Student role
    storage.setActiveRole('student');
    expect(storage.getActiveRole()).toBe('student');
    expect(storage.getStudentToken()).toBe('STUDENT_SECRET_TOKEN_456');
  });

  it('clears all session tokens from sessionStorage on session reset', () => {
    storage.setTeacherToken('TEACHER_TOKEN');
    storage.setStudentToken('STUDENT_TOKEN');
    storage.setSessionId(99);
    storage.setStudentId(88);

    storage.clearSession();

    expect(storage.getTeacherToken()).toBeNull();
    expect(storage.getStudentToken()).toBeNull();
    expect(storage.getSessionId()).toBeNull();
    expect(storage.getStudentId()).toBeNull();
    expect(storage.getActiveRole()).toBeNull();
  });

  // 2. Local Storage Code Draft Security & Isolation Tests
  it('stores only the raw code string in local storage code drafts', () => {
    const sessionId = 10;
    const studentId = 20;
    const sampleCode = 'def solution():\n    return 42';

    storage.setCodeDraft(sessionId, studentId, sampleCode);

    const savedDraft = storage.getCodeDraft(sessionId, studentId);
    expect(savedDraft).toBe(sampleCode);

    // Verify key convention
    const rawKey = `codesphere_code_draft_${sessionId}_${studentId}`;
    expect(localStorage.getItem(rawKey)).toBe(sampleCode);

    // Verify no secret tokens or reference solutions are stored in draft
    expect(localStorage.getItem(rawKey)).not.toContain('TEACHER_SECRET_TOKEN');
    expect(localStorage.getItem(rawKey)).not.toContain('reference_solution');
  });

  // 3. API Error Parsing & Details Array Extraction Tests
  it('correctly parses backend error structure with code, message, and details[]', () => {
    const backendError = {
      response: {
        status: 400,
        data: {
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: ['teacher_email is required', 'language must be python, c, or java'],
          },
        },
      },
    };

    const parsed = parseApiError(backendError);
    expect(parsed).toContain('Validation failed');
    expect(parsed).toContain('teacher_email is required');
    expect(parsed).toContain('language must be python, c, or java');
  });

  it('handles HTTP 408 Timeout, 413 Payload Too Large, 429 Rate Limit, and 503 Unavailable gracefully', () => {
    expect(parseApiError({ response: { status: 408 } })).toContain('Execution timed out');
    expect(parseApiError({ response: { status: 413 } })).toContain('Payload too large');
    expect(parseApiError({ response: { status: 429 } })).toContain('Rate limit exceeded');
    expect(parseApiError({ response: { status: 503 } })).toContain('Service temporarily unavailable');
  });

  it('handles Network Errors without crashing or leaking internal stack traces', () => {
    const networkError = new Error('Network Error');
    const parsed = parseApiError(networkError);
    expect(parsed).toBe('Unable to reach the server. Please verify your internet connection.');
  });

  // 4. Session Expiration & Lock Tests
  it('locks session state on 24-hour timer expiration or teacher termination', () => {
    const { setSessionEnded } = useSessionStore.getState();

    setSessionEnded(true, '24-hour session limit expired');

    const state = useSessionStore.getState();
    expect(state.sessionEnded).toBe(true);
    expect(state.endedReason).toBe('24-hour session limit expired');
  });

  // 5. Teacher Store Dashboard Metrics Fallback & Aggregation Tests
  it('correctly aggregates dashboard metrics fallback when backend returns statistics payload', () => {
    const { setDashboardData } = useTeacherStore.getState();

    setDashboardData(
      {
        total_students: 5,
        online_students: 3,
        offline_students: 2,
        total_code_runs: 15,
        successful_runs: 12,
        failed_runs: 3,
      },
      []
    );

    const metrics = useTeacherStore.getState().metrics;
    expect(metrics.total_students).toBe(5);
    expect(metrics.online_students).toBe(3);
    expect(metrics.offline_students).toBe(2);
    expect(metrics.total_executions).toBe(15);
    expect(metrics.successful_executions).toBe(12);
    expect(metrics.failed_executions).toBe(3);
  });
});
