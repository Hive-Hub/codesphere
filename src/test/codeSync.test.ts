import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../store/editorStore';
import { storage } from '../utils/storage';

describe('Code Editor & Versioning Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    useEditorStore.setState({
      code: '',
      language: 'python',
      stdin: '',
      codeVersion: 0,
      lastSyncedVersion: 0,
      compilerState: 'idle',
      compilerResult: null,
    });
  });

  it('increments code version counter sequentially', () => {
    const { incrementCodeVersion } = useEditorStore.getState();

    const v1 = incrementCodeVersion();
    expect(v1).toBe(1);
    expect(useEditorStore.getState().codeVersion).toBe(1);

    const v2 = incrementCodeVersion();
    expect(v2).toBe(2);
    expect(useEditorStore.getState().codeVersion).toBe(2);
  });

  it('updates code in store and tracks lastSyncedVersion', () => {
    const { setCode, setLastSyncedVersion } = useEditorStore.getState();

    setCode('print("hello codeSync")');
    expect(useEditorStore.getState().code).toBe('print("hello codeSync")');

    setLastSyncedVersion(5);
    expect(useEditorStore.getState().lastSyncedVersion).toBe(5);
  });

  it('saves and retrieves offline code drafts from storage accurately', () => {
    const sessionId = 42;
    const studentId = 7;
    const draftCode = 'x = 10\ny = 20\nprint(x + y)';

    storage.setCodeDraft(sessionId, studentId, draftCode);
    const retrieved = storage.getCodeDraft(sessionId, studentId);

    expect(retrieved).toBe(draftCode);
  });
});
