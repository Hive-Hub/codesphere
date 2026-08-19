import { useRef, useCallback, useEffect } from 'react';
import { socketService } from '../services/socket';
import { useEditorStore } from '../store/editorStore';
import { useStudentStore } from '../store/studentStore';
import { compilerApi } from '../services/compilerApi';
import { storage } from '../utils/storage';

/**
 * useCodeEditor — handles Monaco code changes, debounced sync, cursor, and save.
 *
 * Fixes:
 * - studentId is read reactively from the store (not from storage at init time)
 * - Uses Monaco's latest value directly for socket emission
 * - Code versioning on every emit
 * - localStorage draft backup on every change
 * - Proper timer cleanup on unmount
 */
export function useCodeEditor(sessionId?: number) {
  const { code, language, setCode, setIsSaving, setLastSavedAt, incrementCodeVersion } = useEditorStore();
  const { studentId } = useStudentStore();

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef<boolean>(false);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (codeChangeTimerRef.current) clearTimeout(codeChangeTimerRef.current);
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);

      // Send typing_stop if we were typing
      if (isTypingRef.current && sessionId && studentId) {
        socketService.emitTypingStop(sessionId, studentId);
        isTypingRef.current = false;
      }
    };
  }, [sessionId, studentId]);

  // ── Code change handler (called by Monaco onChange) ──
  const handleCodeChange = useCallback((newCode: string) => {
    // 1. Update local state immediately
    setCode(newCode);

    if (!sessionId || !studentId) return;

    // 2. Save offline draft to localStorage
    storage.setCodeDraft(sessionId, studentId, newCode);

    // 3. Emit typing_start if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.emitTypingStart(sessionId, studentId);
    }

    // 4. Reset typing_stop timer (1.5s after last keystroke)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      if (sessionId && studentId) {
        socketService.emitTypingStop(sessionId, studentId);
      }
    }, 1500);

    // 5. Debounce code_change event (500ms)
    if (codeChangeTimerRef.current) clearTimeout(codeChangeTimerRef.current);
    codeChangeTimerRef.current = setTimeout(() => {
      const version = incrementCodeVersion();
      socketService.emitCodeChange(sessionId, studentId, newCode, { line: 1, column: 1 }, version);
    }, 500);
  }, [sessionId, studentId, setCode, incrementCodeVersion]);

  // ── Cursor change handler (debounced at 100ms) ──
  const handleCursorChange = useCallback((line: number, column: number) => {
    if (!sessionId || !studentId) return;

    if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    cursorTimerRef.current = setTimeout(() => {
      socketService.emitCursorMove(sessionId, studentId, line, column);
    }, 100);
  }, [sessionId, studentId]);

  // ── Explicit save to backend ──
  const saveCode = useCallback(async (): Promise<boolean> => {
    if (!sessionId) return false;
    try {
      setIsSaving(true);
      const res = await compilerApi.saveCode(sessionId, { code, language });
      if (res.success) {
        setLastSavedAt(new Date().toLocaleTimeString());
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, code, language, setIsSaving, setLastSavedAt]);

  return {
    code,
    language,
    handleCodeChange,
    handleCursorChange,
    saveCode,
  };
}
