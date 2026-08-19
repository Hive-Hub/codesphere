import React, { useState, useEffect } from 'react';
import { socketService } from '../../services/socket';
import { networkManager } from '../../services/networkManager';
import { Bug, X, ChevronDown, ChevronUp } from 'lucide-react';

const DEBUG_ENABLED = import.meta.env.VITE_DEBUG_REALTIME === 'true';

/**
 * DebugPanel — Development-only realtime debug panel.
 * Shows socket state, session info, heartbeat, code event, compiler, and network status.
 * Hidden in production (VITE_DEBUG_REALTIME !== 'true').
 */
export const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState(socketService.getDebugInfo());

  useEffect(() => {
    if (!DEBUG_ENABLED) return;

    const interval = setInterval(() => {
      setDebugInfo(socketService.getDebugInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!DEBUG_ENABLED) return null;

  const formatTime = (ts: number) => {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleTimeString();
  };

  const stateColor = (state: string) => {
    switch (state) {
      case 'CONNECTED': return 'text-emerald-400';
      case 'CONNECTING': return 'text-yellow-400';
      case 'RECONNECTING': return 'text-amber-400';
      case 'FAILED': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
        title="Open Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-80 bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden font-mono text-[11px]">
      <div className="bg-purple-600/20 border-b border-purple-500/30 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-300 font-semibold">
          <Bug className="w-3.5 h-3.5" />
          <span>Realtime Debug Panel</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Socket:</span>
          <span className={stateColor(debugInfo.connectionState)}>{debugInfo.connectionState}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Socket ID:</span>
          <span className="text-gray-300">{debugInfo.socketId || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Session:</span>
          <span className="text-indigo-400">{debugInfo.sessionId || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Room:</span>
          <span className="text-cyan-400">{debugInfo.sessionId ? `session:${debugInfo.sessionId}` : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Student:</span>
          <span className="text-amber-400">{debugInfo.studentId || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Role:</span>
          <span className="text-gray-300">{debugInfo.role || '—'}</span>
        </div>

        <div className="border-t border-gray-700 pt-2 mt-2" />

        <div className="flex justify-between">
          <span className="text-gray-500">Last Code Event:</span>
          <span className="text-emerald-400">{formatTime(debugInfo.lastCodeEvent)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Last Heartbeat:</span>
          <span className="text-emerald-400">{formatTime(debugInfo.lastHeartbeat)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Network:</span>
          <span className={networkManager.isOnline() ? 'text-emerald-400' : 'text-rose-400'}>
            {networkManager.isOnline() ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
};
