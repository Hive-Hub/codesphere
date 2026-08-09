import { useState, useCallback } from 'react';
import { compilerApi } from '../services/compilerApi';
import { useEditorStore } from '../store/editorStore';
import { parseApiError } from '../utils/errors';

export function useCompiler(sessionId?: number) {
  const [error, setError] = useState<string | null>(null);
  const { code, language, stdin, setIsRunning, setCompilerResult } = useEditorStore();

  const runCode = useCallback(async () => {
    if (!sessionId) return;
    try {
      setIsRunning(true);
      setError(null);
      const res = await compilerApi.runCode(sessionId, { language, code, stdin });
      if (res.success && res.data) {
        setCompilerResult(res.data);
      } else {
        setError(res.message || 'Execution failed');
      }
    } catch (err: any) {
      const errMsg = parseApiError(err);
      setError(errMsg);
      setCompilerResult({
        stdout: '',
        stderr: errMsg,
        exit_code: 1,
        status: 'error',
      });
    } finally {
      setIsRunning(false);
    }
  }, [sessionId, language, code, stdin]);

  return { runCode, error };
}
