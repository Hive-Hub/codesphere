import { useEffect } from 'react';
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

export function useSocket(sessionId?: number, role?: 'teacher' | 'student') {
  const {
    updateStudentPresence,
    updateStudentCode,
    updateStudentTyping,
    updateStudentCursor,
    addActivityItem,
  } = useTeacherStore();

  const { setSessionEnded } = useSessionStore();

  useEffect(() => {
    if (!sessionId || !role) return;

    // Connect & Join room based on role
    if (role === 'teacher') {
      socketService.joinAsTeacher(sessionId);
    }

    // Set up broadcast event handlers
    const handleStudentJoined = (data: ServerStudentPresenceEvent) => {
      console.log(`[Socket] student_joined received for studentId: ${data.student_id}`);
      updateStudentPresence(data.student_id, 'online', data.name, data.roll_number);
      addActivityItem({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        student_name: data.name,
        student_id: data.student_id,
        event_type: 'student_joined',
        message: `${data.name || 'A student'} joined the session`,
        category: 'presence',
      });
    };

    const handleStudentLeft = (data: ServerStudentPresenceEvent) => {
      console.log(`[Socket] student_left received for studentId: ${data.student_id}`);
      updateStudentPresence(data.student_id, 'offline');
      addActivityItem({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        student_name: data.name,
        student_id: data.student_id,
        event_type: 'student_left',
        message: `${data.name || 'A student'} left the session`,
        category: 'presence',
      });
    };

    const handleCodeUpdated = (data: ServerStudentCodeUpdateEvent) => {
      console.log(`[Socket] student_code_updated received for studentId: ${data.student_id}, codeLength: ${data.code?.length}`);
      updateStudentCode(data.student_id, data.code);
      if (data.cursor) {
        updateStudentCursor(data.student_id, data.cursor.line, data.cursor.column);
      }
      addActivityItem({
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        student_id: data.student_id,
        event_type: 'code_updated',
        message: `Code updated by student #${data.student_id}`,
        category: 'code',
      });
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
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        student_id: data.student_id,
        event_type: data.event_type,
        message: displayMessage,
        category: 'activity',
        metadata: data.metadata,
      });
    };

    const handleSessionEnded = (data: ServerSessionEndedEvent) => {
      setSessionEnded(true, data.reason === '24_hour_expired' ? '24-hour session limit expired' : 'Teacher ended session');
    };

    // Attach listeners
    socketService.on('student_joined', handleStudentJoined);
    socketService.on('student_online', handleStudentJoined);
    socketService.on('student_left', handleStudentLeft);
    socketService.on('student_offline', handleStudentLeft);
    socketService.on('student_code_updated', handleCodeUpdated);
    socketService.on('student_typing', handleTyping);
    socketService.on('student_stopped_typing', handleTyping);
    socketService.on('student_cursor_updated', handleCursor);
    socketService.on('student_activity', handleStudentActivity);
    socketService.on('session_ended', handleSessionEnded);

    return () => {
      socketService.off('student_joined', handleStudentJoined);
      socketService.off('student_online', handleStudentJoined);
      socketService.off('student_left', handleStudentLeft);
      socketService.off('student_offline', handleStudentLeft);
      socketService.off('student_code_updated', handleCodeUpdated);
      socketService.off('student_typing', handleTyping);
      socketService.off('student_stopped_typing', handleTyping);
      socketService.off('student_cursor_updated', handleCursor);
      socketService.off('student_activity', handleStudentActivity);
      socketService.off('session_ended', handleSessionEnded);
    };
  }, [sessionId, role]);

  return { socket: socketService };
}
