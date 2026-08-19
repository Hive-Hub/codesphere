import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { useTeacherStore } from '../store/teacherStore';
import { useSessionStore } from '../store/sessionStore';
import {
  ServerStudentPresenceEvent,
  ServerStudentCodeUpdateEvent,
  ServerStudentTypingEvent,
  ServerStudentCursorEvent,
  ServerSessionEndedEvent,
} from '../types/websocket';

/**
 * useSocket — sets up Socket.IO event listeners for teacher and student roles.
 *
 * - For teacher: listens for student presence, code updates, typing, cursor, activity
 * - For student: listens for session_ended, problem_updated
 * - Both: listens for session_ended
 *
 * Uses off/on pattern to prevent duplicate listeners on re-render.
 */
export function useSocket(sessionId?: number, role?: 'teacher' | 'student') {
  const {
    updateStudentPresence,
    updateStudentCode,
    updateStudentTyping,
    updateStudentCursor,
    addActivityItem,
  } = useTeacherStore();

  const { setSessionEnded, setProblem } = useSessionStore();

  // Track if we've already set up for this session to prevent double-registration
  const setupRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId || !role) return;

    const setupKey = `${sessionId}-${role}`;
    if (setupRef.current === setupKey) return; // Already set up
    setupRef.current = setupKey;

    // ── Teacher joins the session room via socket ──
    if (role === 'teacher') {
      socketService.joinAsTeacher(sessionId);
    }

    // ── Shared: Session ended ──
    const handleSessionEnded = (data: ServerSessionEndedEvent) => {
      console.log('[Socket] session_ended received:', data);
      const reason = data.reason === '24_hour_expired'
        ? '24-hour session limit expired'
        : 'Teacher ended session';
      setSessionEnded(true, reason);

      // Stop all session activity on the socket
      socketService.stopSessionActivity();
    };

    // ── Teacher-specific listeners ──
    const handleStudentJoined = (data: ServerStudentPresenceEvent) => {
      console.log(`[Socket] student_joined/online: student_id=${data.student_id}, name=${data.name || data.student_name}`);
      const name = data.name || data.student_name;
      updateStudentPresence(data.student_id, 'online', name, data.roll_number);
      addActivityItem({
        id: `${data.student_id}-joined-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        student_name: name,
        student_id: data.student_id,
        event_type: 'student_joined',
        message: `${name || 'A student'} joined the session`,
        category: 'presence',
      });
    };

    const handleStudentLeft = (data: ServerStudentPresenceEvent) => {
      console.log(`[Socket] student_left/offline: student_id=${data.student_id}`);
      const name = data.name || data.student_name;
      updateStudentPresence(data.student_id, 'offline');
      addActivityItem({
        id: `${data.student_id}-left-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        student_name: name,
        student_id: data.student_id,
        event_type: 'student_left',
        message: `${name || 'A student'} left the session`,
        category: 'presence',
      });
    };

    const handleCodeUpdated = (data: ServerStudentCodeUpdateEvent) => {
      if (!data.code && data.code !== '') return; // Guard against empty events
      updateStudentCode(data.student_id, data.code, data.version);
      if (data.cursor) {
        updateStudentCursor(data.student_id, data.cursor.line, data.cursor.column);
      }
    };

    const handleTyping = (data: ServerStudentTypingEvent) => {
      const isTyping = data.event === 'student_typing';
      updateStudentTyping(data.student_id, isTyping);
    };

    const handleCursor = (data: ServerStudentCursorEvent) => {
      const line = data.cursor?.line ?? data.line ?? 1;
      const col = data.cursor?.column ?? data.column ?? 1;
      updateStudentCursor(data.student_id, line, col);
    };

    const handleStudentActivity = (data: any) => {
      let displayMessage = `Activity: ${data.event_type}`;
      if (data.event_type === 'paste_attempt') {
        displayMessage = `Paste attempt detected`;
      } else if (data.event_type === 'copy_attempt') {
        displayMessage = `Copy attempt detected`;
      } else if (data.event_type === 'cut_attempt') {
        displayMessage = `Cut attempt detected`;
      } else if (data.event_type === 'tab_blur') {
        displayMessage = `Tab switched (focus lost)`;
      } else if (data.event_type === 'tab_focus') {
        displayMessage = `Tab focused`;
      }

      addActivityItem({
        id: `${data.student_id}-${data.event_type}-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        student_id: data.student_id,
        event_type: data.event_type,
        message: displayMessage,
        category: 'activity',
        metadata: data.metadata,
      });
    };

    // ── Student-specific: problem updates ──
    const handleProblemUpdated = (data: any) => {
      if (data.problem) {
        setProblem(data.problem);
      }
    };

    // ── Register event listeners (off then on to prevent duplicates) ──
    socketService.on('session_ended', handleSessionEnded);

    if (role === 'teacher') {
      socketService.on('student_joined', handleStudentJoined);
      socketService.on('student_online', handleStudentJoined);
      socketService.on('student_left', handleStudentLeft);
      socketService.on('student_offline', handleStudentLeft);
      socketService.on('student_code_updated', handleCodeUpdated);
      socketService.on('student_typing', handleTyping);
      socketService.on('student_stopped_typing', handleTyping);
      socketService.on('student_cursor_updated', handleCursor);
      socketService.on('student_activity', handleStudentActivity);
    }

    if (role === 'student') {
      socketService.on('problem_updated', handleProblemUpdated);
    }

    // ── Cleanup ──
    return () => {
      setupRef.current = null;

      socketService.off('session_ended', handleSessionEnded);

      if (role === 'teacher') {
        socketService.off('student_joined', handleStudentJoined);
        socketService.off('student_online', handleStudentJoined);
        socketService.off('student_left', handleStudentLeft);
        socketService.off('student_offline', handleStudentLeft);
        socketService.off('student_code_updated', handleCodeUpdated);
        socketService.off('student_typing', handleTyping);
        socketService.off('student_stopped_typing', handleTyping);
        socketService.off('student_cursor_updated', handleCursor);
        socketService.off('student_activity', handleStudentActivity);
      }

      if (role === 'student') {
        socketService.off('problem_updated', handleProblemUpdated);
      }
    };
  }, [sessionId, role]);

  return { socket: socketService };
}
