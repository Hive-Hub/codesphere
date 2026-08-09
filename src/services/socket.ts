import { io, Socket } from 'socket.io-client';
import { storage } from '../utils/storage';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://codesphere-backend-x1gl.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private currentSessionId: number | null = null;
  private currentRole: 'teacher' | 'student' | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  public connectionState: 'LIVE' | 'RECONNECTING' | 'OFFLINE' = 'OFFLINE';

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      this.setupBaseListeners();
    }

    this.socket.connect();
    return this.socket;
  }

  private setupBaseListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket.IO] Connected sid:', this.socket?.id);
      this.connectionState = 'LIVE';
      if (this.currentSessionId && this.currentRole) {
        this.rejoinSessionRoom();
      }
      this.startHeartbeat();
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket.IO] Disconnected:', reason);
      this.connectionState = 'OFFLINE';
      this.stopHeartbeat();
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connect error:', error.message);
      this.connectionState = 'RECONNECTING';
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      console.log('[Socket.IO] Reconnect attempt:', attempt);
      this.connectionState = 'RECONNECTING';
    });

    this.socket.io.on('reconnect', (attempt) => {
      console.log('[Socket.IO] Reconnected after attempts:', attempt);
      this.connectionState = 'LIVE';
      if (this.currentSessionId && this.currentRole) {
        this.rejoinSessionRoom();
      }
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('[Socket.IO] Reconnect failed');
      this.connectionState = 'OFFLINE';
    });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected && this.currentSessionId && this.currentRole === 'student') {
        const studentId = storage.getStudentId();
        if (studentId) {
          this.socket.emit('student_heartbeat', {
            session_id: this.currentSessionId,
            student_id: studentId,
          });
        }
      }
    }, 15000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public joinAsTeacher(sessionId: number) {
    this.connect();
    this.currentSessionId = sessionId;
    this.currentRole = 'teacher';
    this.socket?.emit('teacher_join_session', { session_id: sessionId });
  }

  public joinAsStudent(sessionId: number, studentId: number, name: string) {
    this.connect();
    this.currentSessionId = sessionId;
    this.currentRole = 'student';
    this.socket?.emit('student_join_session', {
      session_id: sessionId,
      student_id: studentId,
      name,
    });
  }

  public leaveAsStudent(sessionId: number, studentId: number) {
    this.socket?.emit('student_leave_session', {
      session_id: sessionId,
      student_id: studentId,
    });
  }

  private rejoinSessionRoom() {
    if (!this.currentSessionId || !this.currentRole) return;
    if (this.currentRole === 'teacher') {
      this.socket?.emit('teacher_join_session', { session_id: this.currentSessionId });
    } else if (this.currentRole === 'student') {
      const studentId = storage.getStudentId();
      const studentName = storage.getSessionInfo()?.student?.name || 'Student';
      if (studentId) {
        this.socket?.emit('student_join_session', {
          session_id: this.currentSessionId,
          student_id: studentId,
          name: studentName,
        });
      }
    }
  }

  public emitCodeChange(sessionId: number, studentId: number, code: string, cursor = { line: 1, column: 1 }) {
    this.socket?.emit('code_change', {
      session_id: sessionId,
      student_id: studentId,
      code,
      cursor,
    });
  }

  public emitTypingStart(sessionId: number, studentId: number) {
    this.socket?.emit('typing_start', { session_id: sessionId, student_id: studentId });
  }

  public emitTypingStop(sessionId: number, studentId: number) {
    this.socket?.emit('typing_stop', { session_id: sessionId, student_id: studentId });
  }

  public emitCursorMove(sessionId: number, studentId: number, line: number, column: number) {
    this.socket?.emit('cursor_move', {
      session_id: sessionId,
      student_id: studentId,
      line,
      column,
    });
  }

  public emitActivity(sessionId: number, studentId: number, eventType: string, metadata: any = {}) {
    this.socket?.emit('activity_event', {
      session_id: sessionId,
      student_id: studentId,
      event_type: eventType,
      metadata,
    });
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.connect();
    this.socket?.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentSessionId = null;
    this.currentRole = null;
    this.connectionState = 'OFFLINE';
  }

  public isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

export const socketService = new SocketService();
