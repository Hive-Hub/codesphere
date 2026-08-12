import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { teacherApi, PersistentStats } from '../../services/teacherApi';
import { teacherAuthStore } from '../../store/teacherAuthStore';
import { useSessionStore } from '../../store/sessionStore';
import { storage } from '../../utils/storage';
import {
  Users, Calendar, Clock, CheckCircle2, PlayCircle, PlusCircle,
  FolderOpen, FileText, Search, ArrowRight, RefreshCw, GraduationCap
} from 'lucide-react';

export const TeacherHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(teacherAuthStore.getProfile());
  const [stats, setStats] = useState<PersistentStats | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { setSession, setActiveRole } = useSessionStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Profile
      const profRes = await teacherApi.getProfile();
      if (profRes.success && profRes.data?.teacher) {
        setProfile(profRes.data.teacher);
        teacherAuthStore.setProfile(profRes.data.teacher);
      }

      // 2. Persistent Stats
      const statsRes = await teacherApi.getDashboardStats();
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      // 3. Existing Sessions
      const sessRes = await teacherApi.getSessionsList();
      if (sessRes.success && sessRes.data?.sessions) {
        setSessions(sessRes.data.sessions);
      }
    } catch (e) {
      console.warn('TeacherHomePage fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSession = (session: any) => {
    storage.setActiveRole('teacher');
    storage.setSessionId(session.id);
    if (session.teacher_token) {
      storage.setTeacherToken(session.teacher_token);
    }
    setActiveRole('teacher');
    setSession(session);
    navigate(`/teacher/session/${session.id}/dashboard`);
  };

  const filteredSessions = sessions.filter((s) =>
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.session_code || '').includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-background border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>Teacher Dashboard V2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {profile?.name || 'Sekhar'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              {profile?.college ? `${profile.college} • ${profile.department}` : 'Manage live coding classrooms, view persistent student records, and generate reports anytime.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/teacher/setup')}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap text-sm"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Session</span>
          </button>
        </div>

        {/* Persistent Dashboard Statistics */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white flex items-center justify-between">
            <span>Today & Historical Analytics</span>
            <button onClick={fetchData} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-surface-card border border-border rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-medium">Students Today</span>
              <p className="text-2xl font-black text-indigo-400">{stats?.students_today ?? 0}</p>
            </div>
            <div className="bg-surface-card border border-border rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-medium">Sessions Today</span>
              <p className="text-2xl font-black text-purple-400">{stats?.sessions_today ?? 0}</p>
            </div>
            <div className="bg-surface-card border border-border rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-medium">Active Sessions</span>
              <p className="text-2xl font-black text-emerald-400">{stats?.active_sessions ?? 0}</p>
            </div>
            <div className="bg-surface-card border border-border rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-medium">Completed Sessions</span>
              <p className="text-2xl font-black text-blue-400">{stats?.completed_sessions ?? 0}</p>
            </div>
            <div className="bg-surface-card border border-border rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-medium">Total Students</span>
              <p className="text-2xl font-black text-amber-400">{stats?.total_students ?? 0}</p>
            </div>
            <div className="bg-surface-card border border-border rounded-2xl p-4 space-y-1">
              <span className="text-xs text-gray-400 font-medium">Total Sessions</span>
              <p className="text-2xl font-black text-rose-400">{stats?.total_sessions ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/teacher/sessions')}
            className="bg-surface-card border border-border hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:bg-surface-hover group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
              <span>Existing Sessions</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-gray-400">Reopen historical active or read-only completed coding sessions.</p>
          </div>

          <div
            onClick={() => navigate('/teacher/students')}
            className="bg-surface-card border border-border hover:border-purple-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:bg-surface-hover group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
              <span>Student Directory</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-gray-400">Search students by roll number and review multi-session performance.</p>
          </div>

          <div
            onClick={() => navigate('/teacher/reports')}
            className="bg-surface-card border border-border hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:bg-surface-hover group space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              <span>Reports Generator</span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-gray-400">Generate PDF and Excel reports anytime for Today, Month, or Custom range.</p>
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="bg-surface-card border border-border rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Sessions</h2>
              <p className="text-xs text-gray-400">View live or completed classroom sessions</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              No matching sessions found. Create a new session to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-gray-400 uppercase tracking-wider text-[10px] bg-surface/50">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Students</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-gray-300">
                  {filteredSessions.map((s) => {
                    const isCompleted = s.status === 'ended' || s.status === 'expired';
                    return (
                      <tr key={s.id} className="hover:bg-surface-hover/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{s.title}</td>
                        <td className="py-3 px-4 font-mono text-indigo-400">{s.session_code}</td>
                        <td className="py-3 px-4 uppercase text-[10px] font-bold tracking-wider">{s.language}</td>
                        <td className="py-3 px-4 capitalize">{s.mode}</td>
                        <td className="py-3 px-4">{s.student_count || 0} Students</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              s.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenSession(s)}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg font-semibold transition-all text-xs"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
