import { useState, useCallback } from 'react';
import { aiApi } from '../services/aiApi';
import { useAIStore } from '../store/aiStore';
import { useEditorStore } from '../store/editorStore';
import { parseApiError } from '../utils/errors';

export function useAI(sessionId?: number) {
  const [error, setError] = useState<string | null>(null);
  const { setAIResponse, setLoadingAI } = useAIStore();
  const { code, language, compilerResult } = useEditorStore();

  const explainError = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoadingAI(true);
      setError(null);
      const res = await aiApi.explainError(sessionId, {
        code,
        error_message: compilerResult?.stderr || 'Syntax or runtime error',
        language,
      });
      if (res.success && res.data) {
        setAIResponse(res.data, 'explain');
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoadingAI(false);
    }
  }, [sessionId, code, language, compilerResult]);

  const getHint = useCallback(async (problemDescription?: string) => {
    if (!sessionId) return;
    try {
      setLoadingAI(true);
      setError(null);
      const res = await aiApi.getHint(sessionId, {
        code,
        language,
        problem_description: problemDescription,
      });
      if (res.success && res.data) {
        setAIResponse(res.data, 'hint');
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoadingAI(false);
    }
  }, [sessionId, code, language]);

  const reviewCode = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoadingAI(true);
      setError(null);
      const res = await aiApi.reviewCode(sessionId, {
        code,
        language,
      });
      if (res.success && res.data) {
        setAIResponse(res.data, 'review');
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoadingAI(false);
    }
  }, [sessionId, code, language]);

  return { explainError, getHint, reviewCode, error };
}
