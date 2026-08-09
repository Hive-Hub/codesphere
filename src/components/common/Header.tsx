import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { usePresence } from '../../hooks/usePresence';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { Terminal, Clock, Wifi, WifiOff, Users, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { session, activeRole } = useSessionStore();
  const { isConnected } = usePresence();
  const { formattedTime } = useSessionTimer();

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">CodeSphere AI</h1>
              {activeRole && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {activeRole}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-medium">Intelligent Real-Time Coding Classroom</p>
          </div>
        </Link>

        {/* Active Session Info Bar */}
        {session && (
          <div className="hidden md:flex items-center gap-6 bg-surface-card/60 px-4 py-1.5 rounded-lg border border-border/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Code:</span>
              <span className="font-mono font-bold text-indigo-400 tracking-wider text-sm">
                {session.session_code}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-gray-300">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="capitalize">{session.language}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-gray-300">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="capitalize">{session.mode.replace('_', ' ')}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            {/* Timer */}
            <div className="flex items-center gap-1.5 font-mono text-indigo-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{formattedTime}</span>
            </div>
          </div>
        )}

        {/* Live Socket Presence Status */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LIVE CONNECTED</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">RECONNECTING...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
