import { useRef, useCallback } from 'react';
import { socketService } from '../services/socket';
import { useEditorStore } from '../store/editorStore';
import { compilerApi } from '../services/compilerApi';
import { storage } from '../utils/storage';

export function useCodeEditor(sessionId?: number) {
  const { code, language, setCode, setIsSaving, setLastSavedAt } = useEditorStore();
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const codeChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);

  const studentId = storage.getStudentId();

  // Debounced typing & code change emitter with local draft backup
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);

    if (sessionId && studentId) {
      // Save offline draft to localStorage
      storage.setCodeDraft(sessionId, studentId, newCode);

      // Emit typing_start if not already typing
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        socketService.emitTypingStart(sessionId, studentId);
      }

      // Reset typing_stop timer
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        socketService.emitTypingStop(sessionId, studentId);
      }, 1500);

      // Debounce code_change event (500ms)
      if (codeChangeTimerRef.current) clearTimeout(codeChangeTimerRef.current);
      codeChangeTimerRef.current = setTimeout(() => {
        socketService.emitCodeChange(sessionId, studentId, newCode);
      }, 500);
    }
  }, [sessionId, studentId, setCode]);

  // Debounced cursor emitter
  const handleCursorChange = useCallback((line: number, column: number) => {
    if (!sessionId || !studentId) return;
    socketService.emitCursorMove(sessionId, studentId, line, column);
  }, [sessionId, studentId]);

  // Explicit Save code to backend
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
