import { useEffect, useState, useCallback } from 'react';
import { teacherApi } from '../services/teacherApi';
import { useTeacherStore } from '../store/teacherStore';
import { useSessionStore } from '../store/sessionStore';
import { parseApiError } from '../utils/errors';

export function useTeacherSession(sessionId?: number) {
  const [error, setError] = useState<string | null>(null);
  const { setDashboardData, setLoadingDashboard } = useTeacherStore();
  const { setSession, setProblem } = useSessionStore();

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

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { error, refetchDashboard: fetchDashboard };
}
