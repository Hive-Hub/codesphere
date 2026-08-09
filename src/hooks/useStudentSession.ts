import { useEffect, useState, useCallback } from 'react';
import { studentApi } from '../services/studentApi';
import { useSessionStore } from '../store/sessionStore';
import { useStudentStore } from '../store/studentStore';
import { useEditorStore } from '../store/editorStore';
import { socketService } from '../services/socket';
import { parseApiError } from '../utils/errors';
import { getLanguageDefaultCode } from '../utils/formatting';

export function useStudentSession(sessionId?: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { setSession, setProblem } = useSessionStore();
  const { student, setWarningMessage } = useStudentStore();
  const { setCode, setLanguage } = useEditorStore();

  // Load session & problem details
  const fetchSessionDetails = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await studentApi.getSessionDetails(sessionId);
      if (res.success && res.data) {
        setSession(res.data.session);
        if (res.data.problem) {
          setProblem(res.data.problem);
        }
        const lang = res.data.session.language as 'python' | 'c' | 'java';
        setLanguage(lang);
        
        // Initialize code template if empty
        const initialCode = res.data.student?.current_code || getLanguageDefaultCode(lang);
        setCode(initialCode);

        // Connect student socket
        if (student?.id) {
          socketService.joinAsStudent(sessionId, student.id, student.name);
        }
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [sessionId, student?.id]);

  useEffect(() => {
    fetchSessionDetails();
  }, [fetchSessionDetails]);

  // Anti-cheat activity listeners (Copy/Paste & Tab Blur/Focus)
  useEffect(() => {
    if (!sessionId) return;

    const handlePaste = () => {
      setWarningMessage('Paste action detected. Activity has been recorded.');
      studentApi.reportActivity(sessionId, {
        activity_type: 'paste',
        details: 'User pasted content into workspace editor',
      }).catch(() => {});

      setTimeout(() => setWarningMessage(null), 5000);
    };

    const handleCopy = () => {
      studentApi.reportActivity(sessionId, {
        activity_type: 'copy',
        details: 'User copied content from workspace editor',
      }).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        studentApi.reportActivity(sessionId, {
          activity_type: 'tab_blur',
          details: 'User navigated away from active classroom tab',
        }).catch(() => {});
      } else {
        studentApi.reportActivity(sessionId, {
          activity_type: 'tab_focus',
          details: 'User returned to active classroom tab',
        }).catch(() => {});
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId]);

  return { loading, error, refetchSessionDetails: fetchSessionDetails };
}
