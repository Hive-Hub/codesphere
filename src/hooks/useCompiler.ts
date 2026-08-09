import { useState, useCallback } from 'react';
import { compilerApi } from '../services/compilerApi';
import { useEditorStore } from '../store/editorStore';
import { parseApiError } from '../utils/errors';
import { CompilerResult } from '../types/compiler';

export function useCompiler(sessionId?: number) {
  const [error, setError] = useState<string | null>(null);
  const { code, language, stdin, setIsRunning, setCompilerResult } = useEditorStore();

  const runCode = useCallback(async (): Promise<CompilerResult | null> => {
    if (!sessionId) return null;
    try {
      setIsRunning(true);
      setError(null);

      const res = await compilerApi.runCode(sessionId, {
        language: language.toLowerCase() as 'python' | 'c' | 'java',
        code,
        stdin,
      });

      if (res.success && res.data) {
        const raw = res.data;
        const normalizedResult: CompilerResult = {
          stdout: raw.stdout || raw.output || '',
          stderr: raw.stderr || raw.error || '',
          exit_code: raw.exit_code ?? 0,
          execution_time: raw.execution_time || '0.0s',
          memory: raw.memory || '0KB',
          status: raw.exit_code === 0 ? 'success' : (raw.status || 'error'),
        };

        setCompilerResult(normalizedResult);
        return normalizedResult;
      } else {
        const errMsg = res.message || 'Code execution failed';
        setError(errMsg);
        const failedResult: CompilerResult = {
          stdout: '',
          stderr: errMsg,
          exit_code: 1,
          status: 'error',
        };
        setCompilerResult(failedResult);
        return failedResult;
      }
    } catch (err: any) {
      const errMsg = parseApiError(err);
      setError(errMsg);

      let statusType: CompilerResult['status'] = 'error';
      if (errMsg.toLowerCase().includes('time')) {
        statusType = 'timeout';
      }

      const errorResult: CompilerResult = {
        stdout: '',
        stderr: errMsg,
        exit_code: 1,
        status: statusType,
      };

      setCompilerResult(errorResult);
      return errorResult;
    } finally {
      setIsRunning(false);
    }
  }, [sessionId, language, code, stdin, setIsRunning, setCompilerResult]);

  return { runCode, error };
}
