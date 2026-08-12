import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { teacherApi } from '../../services/teacherApi';
import { useSessionStore } from '../../store/sessionStore';
import { storage } from '../../utils/storage';
import { FolderOpen, Search, ArrowLeft, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

export const TeacherSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { setSession, setActiveRole } = useSessionStore();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getSessionsList();
      if (res.success && res.data?.sessions) {
        setSessions(res.data.sessions);
      }
    } catch (e) {
      console.warn('TeacherSessionsPage error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSession = (s: any) => {
    storage.setActiveRole('teacher');
    storage.setSessionId(s.id);
    if (s.teacher_token) {
      storage.setTeacherToken(s.teacher_token);
    }
    setActiveRole('teacher');
    setSession(s);
    navigate(`/teacher/session/${s.id}/dashboard`);
  };

  const filtered = sessions.filter((s) => {
    const isCompleted = s.status === 'ended' || s.status === 'expired';
    if (filterMode === 'active' && s.status !== 'active') return false;
    if (filterMode === 'completed' && !isCompleted) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (s.title || '').toLowerCase().includes(q) ||
        (s.subject || '').toLowerCase().includes(q) ||
        (s.session_code || '').includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/teacher/home')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard Home</span>
            </button>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-indigo-400" />
              <span>Existing Sessions</span>
            </h1>
            <p className="text-xs text-gray-400">Review completed classrooms or return to active coding sessions</p>
          </div>

          <button
            onClick={() => navigate('/teacher/setup')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Session</span>
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-surface/80 p-1.5 rounded-xl border border-border w-full sm:w-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({sessions.length})
            </button>
            <button
              onClick={() => setFilterMode('active')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'active' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Active ({sessions.filter((s) => s.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'completed' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Completed ({sessions.filter((s) => s.status === 'ended' || s.status === 'expired').length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, subject, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-xs">Loading existing sessions...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500 text-xs">No sessions found matching criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => {
              const isCompleted = s.status === 'ended' || s.status === 'expired';
              const createdDate = s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

              return (
                <div
                  key={s.id}
                  className="bg-surface-card border border-border hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        {isCompleted ? 'Completed (Read-Only)' : 'Live Active'}
                      </span>
                      <span className="font-mono text-xs text-indigo-400 font-semibold">{s.session_code}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-xs text-gray-400">{s.subject} • {s.college}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-400 border-t border-border/50">
                      <div>
                        <span className="block font-semibold text-white">{s.student_count || 0} Students</span>
                        <span>Enrolled</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-white uppercase">{s.language}</span>
                        <span className="capitalize">{s.mode}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                    <span className="text-gray-500 text-[11px]">{createdDate}</span>
                    <button
                      onClick={() => handleOpenSession(s)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-indigo-600/20"
                    >
                      View Session
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
