import React from 'react';
import { useSessionStore } from '../../store/sessionStore';
import { usePresence } from '../../hooks/usePresence';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { Terminal, Clock, Wifi, WifiOff, LayoutDashboard, FolderOpen, Users, FileText, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { session, activeRole } = useSessionStore();
  const { isConnected } = usePresence();
  const { formattedTime } = useSessionTimer();
  const location = useLocation();

  const isTeacher = activeRole === 'teacher' || location.pathname.startsWith('/teacher');

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link to={isTeacher ? "/teacher/home" : "/"} className="flex items-center gap-3 group">
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
            <p className="text-xs text-gray-400 font-medium">Intelligent Real-Time Coding Platform</p>
          </div>
        </Link>

        {/* Teacher V2 Navigation Bar */}
        {isTeacher && (
          <nav className="hidden md:flex items-center gap-1 bg-surface-card/60 p-1 rounded-xl border border-border/80 text-xs">
            <Link
              to="/teacher/home"
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/teacher/home' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/teacher/sessions"
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/teacher/sessions' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Live Sessions</span>
            </Link>
            <Link
              to="/teacher/students"
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/teacher/students' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students</span>
            </Link>
            <Link
              to="/teacher/reports"
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/teacher/reports' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports</span>
            </Link>
          </nav>
        )}

        {/* Active Session Info Bar & Connection Status */}
        <div className="flex items-center gap-3">
          {session && (
            <div className="hidden lg:flex items-center gap-3 bg-surface-card px-3 py-1 rounded-lg border border-border text-xs">
              <span className="text-gray-400">Code:</span>
              <span className="font-mono font-bold text-indigo-400 text-xs">{session.session_code}</span>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1 text-indigo-300 font-mono">
                <Clock className="w-3 h-3 text-indigo-400 animate-pulse" />
                <span>{formattedTime}</span>
              </div>
            </div>
          )}

          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LIVE</span>
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
