import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { socketService } from '../services/socket';
import { useSessionStore } from '../store/sessionStore';

describe('SocketService & State Machine Unit Tests', () => {
  beforeEach(() => {
    socketService.disconnect();
    useSessionStore.getState().resetSession();
  });

  afterEach(() => {
    socketService.disconnect();
  });

  it('starts in DISCONNECTED state', () => {
    expect(socketService.getConnectionState()).toBe('DISCONNECTED');
  });

  it('allows subscribing to state changes', () => {
    const states: string[] = [];
    const unsub = socketService.subscribeState((state) => {
      states.push(state);
    });

    expect(states[0]).toBe('DISCONNECTED');
    unsub();
  });

  it('provides debug info snapshot', () => {
    const info = socketService.getDebugInfo();
    expect(info).toHaveProperty('connectionState');
    expect(info).toHaveProperty('sessionId');
    expect(info).toHaveProperty('studentId');
    expect(info).toHaveProperty('role');
    expect(info.connectionState).toBe('DISCONNECTED');
  });

  it('stops heartbeat and clears state on disconnect()', () => {
    socketService.joinAsStudent(101, 202, 'Alice');
    expect(socketService.getSessionId()).toBe(101);
    expect(socketService.getStudentId()).toBe(202);

    socketService.disconnect();
    expect(socketService.getSessionId()).toBeNull();
    expect(socketService.getStudentId()).toBeNull();
    expect(socketService.getConnectionState()).toBe('DISCONNECTED');
  });

  it('does not emit code_change when disconnected', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    socketService.emitCodeChange(101, 202, 'print("hello")');
    expect(socketService.getDebugInfo().lastCodeEvent).toBe(0);
    warnSpy.mockRestore();
  });

  it('stops session activity cleanly on stopSessionActivity()', () => {
    socketService.joinAsStudent(101, 202, 'Alice');
    socketService.stopSessionActivity();
    // Heartbeat interval cleared without disconnecting socket state fully
    expect(socketService.getSessionId()).toBe(101);
  });
});
