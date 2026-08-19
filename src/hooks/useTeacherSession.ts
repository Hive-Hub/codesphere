import { useEffect, useState, useCallback, useRef } from 'react';
import { teacherApi } from '../services/teacherApi';
import { useTeacherStore } from '../store/teacherStore';
import { useSessionStore } from '../store/sessionStore';
import { parseApiError } from '../utils/errors';

/**
 * useTeacherSession — loads initial dashboard data and handles REST reconciliation.
 *
 * Reconciliation runs:
 * - On initial mount
 * - On tab focus (when user returns to browser)
 * - Can be triggered manually via refetchDashboard
 *
 * REST = initial truth, Socket.IO = live updates.
 * reconcileStudents merges both without duplicating.
 */
export function useTeacherSession(sessionId?: number) {
  const [error, setError] = useState<string | null>(null);
  const { setDashboardData, reconcileStudents, setLoadingDashboard } = useTeacherStore();
  const { setSession, setProblem } = useSessionStore();
  const initRef = useRef(false);

  const fetchDashboard = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoadingDashboard(true);
      setError(null);
      const res = await teacherApi.getDashboard(sessionId);
      if (res.success && res.data) {
        setSession(res.data.session);
        if (res.data.problem) {
          setProblem(res.data.problem);
        }
        const rawMetrics = res.data.statistics || res.data.metrics || {};
        setDashboardData(rawMetrics, res.data.students || []);
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoadingDashboard(false);
    }
  }, [sessionId]);

  // Reconciliation: fetch REST data and merge with socket state
  const reconcile = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await teacherApi.getDashboard(sessionId);
      if (res.success && res.data?.students) {
        reconcileStudents(res.data.students);
      }
    } catch {
      // Silent — don't overwrite existing data on reconciliation failure
    }
  }, [sessionId, reconcileStudents]);

  // Initial fetch
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    fetchDashboard();
  }, [fetchDashboard]);

  // Reconcile on tab focus
  useEffect(() => {
    if (!sessionId) return;

    const handleVisibility = () => {
      if (!document.hidden) {
        reconcile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [sessionId, reconcile]);

  return { error, refetchDashboard: fetchDashboard, reconcile };
}
