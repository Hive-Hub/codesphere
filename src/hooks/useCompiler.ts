import { useState, useCallback, useRef } from 'react';
import { compilerApi } from '../services/compilerApi';
import { useEditorStore } from '../store/editorStore';
import { parseApiError } from '../utils/errors';
import { CompilerResult, CompilerState } from '../types/compiler';

const COMPILER_TIMEOUT_MS = 45000; // 45 seconds frontend timeout

/**
 * useCompiler — handles code execution with proper state machine,
 * double-submit prevention, timeout handling, and error normalization.
 */
export function useCompiler(sessionId?: number) {
  const [error, setError] = useState<string | null>(null);
  const [timeoutWarning, setTimeoutWarning] = useState<boolean>(false);
  const { code, language, stdin, setIsRunning, setCompilerResult, setCompilerState } = useEditorStore();
  const isRunningRef = useRef(false);

  const runCode = useCallback(async (): Promise<CompilerResult | null> => {
    if (!sessionId) return null;

    // ── Double-submit prevention ──
    if (isRunningRef.current) {
      console.warn('[Compiler] Already running, ignoring duplicate request');
      return null;
    }

    isRunningRef.current = true;
    setIsRunning(true);
    setError(null);
    setTimeoutWarning(false);
    setCompilerState('running');

    // ── Timeout warning after 15 seconds ──
    const warningTimer = setTimeout(() => {
      setTimeoutWarning(true);
    }, 15000);

    // ── Hard timeout after COMPILER_TIMEOUT_MS ──
    const timeoutController = new AbortController();
    const hardTimeout = setTimeout(() => {
      timeoutController.abort();
    }, COMPILER_TIMEOUT_MS);

    try {
      const res = await compilerApi.runCode(sessionId, {
        language: language.toLowerCase() as 'python' | 'c' | 'java',
        code,
        stdin,
      });

      clearTimeout(warningTimer);
      clearTimeout(hardTimeout);

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

        // Determine compiler state from result
        let state: CompilerState = 'success';
        if (raw.exit_code !== 0) {
          if (raw.status === 'compilation_error') state = 'compilation_error';
          else if (raw.status === 'timeout') state = 'timeout';
          else state = 'runtime_error';
        }

        setCompilerResult(normalizedResult);
        setCompilerState(state);
        return normalizedResult;
      } else {
        const errMsg = res.message || 'Code execution failed';
        setError(errMsg);

        // Check for specific error codes
        const errorCode = (res as any).error?.code;
        let state: CompilerState = 'runtime_error';
        if (errorCode === 'COMPILER_UNAVAILABLE') state = 'unavailable';
        else if (errorCode === 'COMPILER_TIMEOUT') state = 'timeout';

        const failedResult: CompilerResult = {
          stdout: '',
          stderr: errMsg,
          exit_code: 1,
          status: 'error',
        };
        setCompilerResult(failedResult);
        setCompilerState(state);
        return failedResult;
      }
    } catch (err: any) {
      clearTimeout(warningTimer);
      clearTimeout(hardTimeout);

      const errMsg = parseApiError(err);
      setError(errMsg);

      let state: CompilerState = 'network_error';
      let statusType: CompilerResult['status'] = 'error';

      if (err.name === 'AbortError' || errMsg.toLowerCase().includes('timeout') || errMsg.toLowerCase().includes('timed out')) {
        state = 'timeout';
        statusType = 'timeout';
      } else if (errMsg.toLowerCase().includes('unavailable')) {
        state = 'unavailable';
      } else if (errMsg.toLowerCase().includes('network')) {
        state = 'network_error';
      }

      const errorResult: CompilerResult = {
        stdout: '',
        stderr: errMsg,
        exit_code: 1,
        status: statusType,
      };

      setCompilerResult(errorResult);
      setCompilerState(state);
      return errorResult;
    } finally {
      isRunningRef.current = false;
      setIsRunning(false);
      setTimeoutWarning(false);
    }
  }, [sessionId, language, code, stdin, setIsRunning, setCompilerResult, setCompilerState]);

  return { runCode, error, timeoutWarning };
}
