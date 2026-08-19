import { useEffect, useState, useCallback, useRef } from 'react';
import { studentApi } from '../services/studentApi';
import { useSessionStore } from '../store/sessionStore';
import { useStudentStore } from '../store/studentStore';
import { useEditorStore } from '../store/editorStore';
import { socketService } from '../services/socket';
import { parseApiError } from '../utils/errors';
import { getLanguageDefaultCode } from '../utils/formatting';
import { storage } from '../utils/storage';

/**
 * useStudentSession — manages the student session lifecycle.
 *
 * Sequence: fetch session details → set session/problem/language → init code →
 *           connect socket → join room → set workspace READY.
 *
 * Also handles: activity listeners (copy/paste/tab), draft restoration prompt.
 */
export function useStudentSession(sessionId?: number) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const { setSession, setProblem, setWorkspaceStatus, sessionEnded } = useSessionStore();
  const { student, studentId, setWarningMessage, setDraftAvailable } = useStudentStore();
  const { setCode, setLanguage, code } = useEditorStore();

  // ── Fetch session details and initialize workspace ──
  const fetchSessionDetails = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      setError(null);
      setWorkspaceStatus('LOADING');

      const res = await studentApi.getSessionDetails(sessionId);
      if (res.success && res.data) {
        setSession(res.data.session);
        if (res.data.problem) {
          setProblem(res.data.problem);
        }

        const lang = (res.data.session.language as 'python' | 'c' | 'java') || 'python';
        setLanguage(lang);

        // Get server code
        const serverCode = res.data.student?.current_code || '';
        const defaultCode = getLanguageDefaultCode(lang);

        // Check for local draft
        const sid = student?.id || studentId;
        const localDraft = sid ? storage.getCodeDraft(sessionId, sid) : null;

        if (localDraft && localDraft.trim().length > 0 && serverCode && serverCode.trim().length > 0 && localDraft !== serverCode) {
          // Both draft and server code exist and differ — show restoration dialog
          setCode(serverCode); // Default to server version
          setDraftAvailable(true, localDraft);
        } else if (localDraft && localDraft.trim().length > 0 && (!serverCode || serverCode.trim().length === 0)) {
          // Only local draft exists — use it
          setCode(localDraft);
          setDraftAvailable(false, null);
        } else {
          // Use server code or default
          setCode(serverCode || defaultCode);
          setDraftAvailable(false, null);
        }

        // Connect socket and join room
        const sId = student?.id || studentId;
        const sName = student?.name || 'Student';
        if (sId) {
          socketService.joinAsStudent(sessionId, sId, sName);
        }

        setWorkspaceStatus('READY');
      } else {
        setError(res.message || 'Failed to load session');
        setWorkspaceStatus('ERROR');
      }
    } catch (err: any) {
      const msg = parseApiError(err);
      setError(msg);
      setWorkspaceStatus('ERROR');
    } finally {
      setLoading(false);
    }
  }, [sessionId, student?.id, studentId]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    fetchSessionDetails();
  }, [fetchSessionDetails]);

  // ── Anti-cheat activity listeners ──
  useEffect(() => {
    if (!sessionId || sessionEnded) return;

    const cooldowns: Record<string, number> = {};

    const reportWithCooldown = (activityType: string, details: string, warningMsg?: string) => {
      const now = Date.now();
      if (cooldowns[activityType] && now - cooldowns[activityType] < 3000) return;
      cooldowns[activityType] = now;

      if (warningMsg) {
        setWarningMessage(warningMsg);
        setTimeout(() => setWarningMessage(null), 5000);
      }

      // Report via REST
      studentApi.reportActivity(sessionId, {
        activity_type: activityType,
        details,
      }).catch(() => {});

      // Report via Socket
      const sid = student?.id || studentId;
      if (sid) {
        socketService.emitActivity(sessionId, sid, activityType, {
          timestamp: new Date().toISOString(),
        });
      }
    };

    const handlePaste = (e: Event) => {
      e.preventDefault();
      reportWithCooldown('paste_attempt', 'User pasted content', 'Paste action detected. Activity has been recorded.');
    };

    const handleCopy = () => {
      reportWithCooldown('copy_attempt', 'User copied content');
    };

    const handleCut = (e: Event) => {
      e.preventDefault();
      reportWithCooldown('cut_attempt', 'User cut content', 'Cut action detected. Activity has been recorded.');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportWithCooldown('tab_blur', 'User navigated away');
      } else {
        reportWithCooldown('tab_focus', 'User returned');
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sessionId, sessionEnded, student?.id, studentId]);

  return { loading, error, refetchSessionDetails: fetchSessionDetails };
}
