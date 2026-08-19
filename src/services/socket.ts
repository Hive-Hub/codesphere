import { io, Socket } from 'socket.io-client';
import { storage } from '../utils/storage';
import { SocketConnectionState } from '../types/websocket';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://codesphere-backend-x1gl.onrender.com';
const DEBUG = import.meta.env.VITE_DEBUG_REALTIME === 'true';

function debugLog(...args: any[]): void {
  if (DEBUG) {
    console.log('[Socket.IO]', ...args);
  }
}

function debugWarn(...args: any[]): void {
  if (DEBUG) {
    console.warn('[Socket.IO]', ...args);
  }
}

type StateListener = (state: SocketConnectionState) => void;

/**
 * SocketService — singleton Socket.IO connection manager.
 *
 * State machine: DISCONNECTED → CONNECTING → CONNECTED → RECONNECTING → FAILED
 *
 * Rules:
 * - ONE socket connection per application lifetime
 * - Components subscribe to state changes, don't create their own connections
 * - Heartbeat managed internally, tied to student role
 * - On reconnect: rejoin room, restart heartbeat, notify listeners
 * - Duplicate listeners prevented by off/on pattern
 */
class SocketService {
  private socket: Socket | null = null;
  private currentSessionId: number | null = null;
  private currentStudentId: number | null = null;
  private currentStudentName: string = 'Student';
  private currentRole: 'teacher' | 'student' | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private connectionState: SocketConnectionState = 'DISCONNECTED';
  private stateListeners: Set<StateListener> = new Set();
  private connecting = false;
  private lastHeartbeatTime: number = 0;
  private lastCodeEventTime: number = 0;

  // ─── Connection State Machine ───────────────────────────────────────

  public getConnectionState(): SocketConnectionState {
    return this.connectionState;
  }

  private setConnectionState(state: SocketConnectionState): void {
    if (this.connectionState === state) return;
    const prev = this.connectionState;
    this.connectionState = state;
    debugLog(`State: ${prev} → ${state}`);
    this.stateListeners.forEach((fn) => {
      try { fn(state); } catch (e) { console.error('[Socket] State listener error:', e); }
    });
  }

  public subscribeState(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    // Immediately fire current state so subscriber is in sync
    try { listener(this.connectionState); } catch {}
    return () => { this.stateListeners.delete(listener); };
  }

  // ─── Debug Info ─────────────────────────────────────────────────────

  public getDebugInfo(): {
    socketId: string | null;
    connectionState: SocketConnectionState;
    sessionId: number | null;
    studentId: number | null;
    role: string | null;
    lastHeartbeat: number;
    lastCodeEvent: number;
  } {
    return {
      socketId: this.socket?.id || null,
      connectionState: this.connectionState,
      sessionId: this.currentSessionId,
      studentId: this.currentStudentId,
      role: this.currentRole,
      lastHeartbeat: this.lastHeartbeatTime,
      lastCodeEvent: this.lastCodeEventTime,
    };
  }

  // ─── Connection ─────────────────────────────────────────────────────

  public connect(): Socket {
    // If already connected, return existing socket
    if (this.socket?.connected) {
      return this.socket;
    }

    // Prevent concurrent connect() calls
    if (this.connecting && this.socket) {
      return this.socket;
    }

    if (!this.socket) {
      this.connecting = true;
      this.setConnectionState('CONNECTING');

      this.socket = io(SOCKET_URL, {
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 8000,
        timeout: 30000,
      });

      this.setupBaseListeners();
    }

    if (!this.socket.connected) {
      this.connecting = true;
      this.setConnectionState('CONNECTING');
      this.socket.connect();
    }

    return this.socket;
  }

  private setupBaseListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.connecting = false;
      console.log('[Socket.IO] Connected. sid:', this.socket?.id);
      this.setConnectionState('CONNECTED');

      // If we have an active session, rejoin the room
      if (this.currentSessionId && this.currentRole) {
        this.rejoinSessionRoom();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket.IO] Disconnected:', reason);
      this.stopHeartbeat();

      // If server disconnected us, we need manual reconnect
      if (reason === 'io server disconnect') {
        this.setConnectionState('DISCONNECTED');
      } else {
        // Client-side disconnect or transport close — will auto-reconnect
        this.setConnectionState('RECONNECTING');
      }
    });

    this.socket.on('connect_error', (error) => {
      this.connecting = false;
      console.error('[Socket.IO] Connect error:', error.message);
      // Don't set FAILED immediately — let reconnection attempts continue
      if (this.connectionState !== 'RECONNECTING') {
        this.setConnectionState('RECONNECTING');
      }
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      debugLog('Reconnect attempt:', attempt);
      this.setConnectionState('RECONNECTING');
    });

    this.socket.io.on('reconnect', (attempt) => {
      console.log('[Socket.IO] Reconnected after', attempt, 'attempts');
      this.setConnectionState('CONNECTED');

      // Rejoin room and restart heartbeat after reconnection
      if (this.currentSessionId && this.currentRole) {
        this.rejoinSessionRoom();
      }
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('[Socket.IO] Reconnect failed after all attempts');
      this.setConnectionState('FAILED');
    });
  }

  // ─── Session Room Management ────────────────────────────────────────

  public joinAsTeacher(sessionId: number): void {
    this.currentSessionId = sessionId;
    this.currentRole = 'teacher';
    this.currentStudentId = null;

    this.connect();

    if (this.socket?.connected) {
      debugLog('teacher_join_session', { session_id: sessionId });
      this.socket.emit('teacher_join_session', { session_id: sessionId });
    }
    // If not connected yet, rejoinSessionRoom will fire on 'connect' event
  }

  public joinAsStudent(sessionId: number, studentId: number, name: string): void {
    this.currentSessionId = sessionId;
    this.currentRole = 'student';
    this.currentStudentId = studentId;
    this.currentStudentName = name;

    this.connect();

    if (this.socket?.connected) {
      this.emitStudentJoin();
      this.startHeartbeat();
    }
    // If not connected yet, rejoinSessionRoom will fire on 'connect' event
  }

  public leaveAsStudent(sessionId: number, studentId: number): void {
    if (this.socket?.connected) {
      this.socket.emit('student_leave_session', {
        session_id: sessionId,
        student_id: studentId,
      });
    }
    this.stopHeartbeat();
  }

  private emitStudentJoin(): void {
    if (!this.socket?.connected || !this.currentSessionId || !this.currentStudentId) return;

    debugLog('student_join_session', {
      session_id: this.currentSessionId,
      student_id: this.currentStudentId,
      name: this.currentStudentName,
    });

    this.socket.emit('student_join_session', {
      session_id: this.currentSessionId,
      student_id: this.currentStudentId,
      name: this.currentStudentName,
    });
  }

  private rejoinSessionRoom(): void {
    if (!this.currentSessionId || !this.currentRole) return;

    debugLog('Rejoining session room:', this.currentSessionId, 'as', this.currentRole);

    if (this.currentRole === 'teacher') {
      this.socket?.emit('teacher_join_session', { session_id: this.currentSessionId });
    } else if (this.currentRole === 'student') {
      this.emitStudentJoin();
      this.startHeartbeat();
    }
  }

  // ─── Heartbeat ──────────────────────────────────────────────────────

  private startHeartbeat(): void {
    this.stopHeartbeat();

    if (this.currentRole !== 'student' || !this.currentStudentId || !this.currentSessionId) {
      return;
    }

    debugLog('Heartbeat started (15s interval)');

    // Send immediate heartbeat
    this.sendHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 15000);
  }

  private sendHeartbeat(): void {
    if (!this.socket?.connected || !this.currentSessionId || !this.currentStudentId) return;

    this.socket.emit('student_heartbeat', {
      session_id: this.currentSessionId,
      student_id: this.currentStudentId,
    });
    this.lastHeartbeatTime = Date.now();
    debugLog('Heartbeat sent');
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      debugLog('Heartbeat stopped');
    }
  }

  // ─── Event Emission (Student → Backend) ─────────────────────────────

  public emitCodeChange(
    sessionId: number,
    studentId: number,
    code: string,
    cursor = { line: 1, column: 1 },
    version?: number
  ): void {
    if (!this.socket?.connected) {
      debugWarn('emitCodeChange skipped — socket not connected');
      return;
    }

    const payload: any = {
      session_id: sessionId,
      student_id: studentId,
      code,
      cursor,
    };
    if (version !== undefined) {
      payload.version = version;
    }

    this.socket.emit('code_change', payload);
    this.lastCodeEventTime = Date.now();
    debugLog('code_change emitted, length:', code.length);
  }

  public emitTypingStart(sessionId: number, studentId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('typing_start', { session_id: sessionId, student_id: studentId });
  }

  public emitTypingStop(sessionId: number, studentId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('typing_stop', { session_id: sessionId, student_id: studentId });
  }

  public emitCursorMove(sessionId: number, studentId: number, line: number, column: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('cursor_move', {
      session_id: sessionId,
      student_id: studentId,
      line,
      column,
    });
  }

  public emitActivity(sessionId: number, studentId: number, eventType: string, metadata: any = {}): void {
    if (!this.socket?.connected) return;
    this.socket.emit('activity_event', {
      session_id: sessionId,
      student_id: studentId,
      event_type: eventType,
      metadata,
    });
    debugLog('activity_event emitted:', eventType);
  }

  // ─── Event Subscription (Backend → Frontend) ───────────────────────

  /**
   * Register a listener. Uses off/on pattern to prevent duplicates.
   */
  public on(event: string, callback: (...args: any[]) => void): void {
    this.connect();
    // Remove any previous identical listener reference
    this.socket?.off(event, callback);
    this.socket?.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback);
  }

  // ─── Session End / Cleanup ──────────────────────────────────────────

  /**
   * Stop all session activity without disconnecting the socket.
   * Used when session ends but we want to keep listening for final events.
   */
  public stopSessionActivity(): void {
    this.stopHeartbeat();
    debugLog('Session activity stopped (heartbeat, will no longer emit code/typing/cursor)');
  }

  /**
   * Full disconnect and cleanup.
   */
  public disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentSessionId = null;
    this.currentStudentId = null;
    this.currentRole = null;
    this.connecting = false;
    this.setConnectionState('DISCONNECTED');
    debugLog('Fully disconnected and cleaned up');
  }

  public isConnected(): boolean {
    return !!this.socket?.connected;
  }

  public getSessionId(): number | null {
    return this.currentSessionId;
  }

  public getStudentId(): number | null {
    return this.currentStudentId;
  }
}

export const socketService = new SocketService();
