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
      updateStudentCode(data.student_id, data.code);
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
      updateStudentCursor(data.student_id, data.line, data.column);
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
      socketService.off('session_ended', handleSessionEnded);
    };
  }, [sessionId, role]);

  return { socket: socketService };
}
