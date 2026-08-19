import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../store/editorStore';
import { CompilerState, CompilerResult } from '../types/compiler';

describe('Compiler State Machine & Results Tests', () => {
  beforeEach(() => {
    useEditorStore.setState({
      code: '',
      language: 'python',
      stdin: '',
      isRunning: false,
      compilerResult: null,
      compilerState: 'idle',
      activeConsoleTab: 'output',
    });
  });

  it('initializes compilerState as idle', () => {
    expect(useEditorStore.getState().compilerState).toBe('idle');
    expect(useEditorStore.getState().compilerResult).toBeNull();
  });

  it('transitions compilerState across execution states', () => {
    const { setCompilerState, setIsRunning } = useEditorStore.getState();

    setIsRunning(true);
    setCompilerState('running');
    expect(useEditorStore.getState().compilerState).toBe('running');
    expect(useEditorStore.getState().isRunning).toBe(true);

    setIsRunning(false);
    setCompilerState('success');
    expect(useEditorStore.getState().compilerState).toBe('success');
    expect(useEditorStore.getState().isRunning).toBe(false);
  });

  it('auto-selects errors console tab when compilerResult contains stderr', () => {
    const { setCompilerResult } = useEditorStore.getState();

    const resultWithStderr: CompilerResult = {
      stdout: '',
      stderr: 'SyntaxError: unexpected EOF while parsing',
      exit_code: 1,
      status: 'compilation_error',
    };

    setCompilerResult(resultWithStderr);

    const state = useEditorStore.getState();
    expect(state.compilerResult?.stderr).toBe('SyntaxError: unexpected EOF while parsing');
    expect(state.activeConsoleTab).toBe('errors');
  });

  it('keeps output console tab when compilerResult is successful', () => {
    const { setCompilerResult } = useEditorStore.getState();

    const successResult: CompilerResult = {
      stdout: 'Hello World\n',
      stderr: '',
      exit_code: 0,
      status: 'success',
    };

    setCompilerResult(successResult);

    const state = useEditorStore.getState();
    expect(state.activeConsoleTab).toBe('output');
    expect(state.compilerResult?.stdout).toBe('Hello World\n');
  });
});
