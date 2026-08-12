import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { teacherApi, StudentHistoryRecord } from '../../services/teacherApi';
import { Users, Search, ArrowLeft, RefreshCw, Layers, Award, Terminal, Calendar, ChevronRight, X } from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentHistoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<StudentHistoryRecord | null>(null);

  useEffect(() => {
    fetchStudents('');
  }, []);

  const fetchStudents = async (q: string) => {
    setLoading(true);
    try {
      const res = await teacherApi.searchStudents(q);
      if (res.success && res.data?.students) {
        setStudents(res.data.students);
      }
    } catch (e) {
      console.warn('TeacherStudentsPage search error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(searchQuery);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
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
              <Users className="w-6 h-6 text-purple-400" />
              <span>Persistent Student Directory & History</span>
            </h1>
            <p className="text-xs text-gray-400">Search student identity by Name or Roll Number and inspect multi-session progress</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search Name or Roll Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Student Cards List */}
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-xs">Searching student records...</div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center text-gray-500 text-xs">No student records found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((st) => (
              <div
                key={st.student_id}
                className="bg-surface-card border border-border hover:border-purple-500/40 rounded-2xl p-5 space-y-4 transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {st.department} • {st.year} ({st.section})
                    </span>
                    <span className="font-mono text-xs text-purple-400 font-bold">{st.roll_number}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                      {st.name}
                    </h3>
                    <p className="text-xs text-gray-400">Total Sessions Participated: {st.total_sessions}</p>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50 text-center">
                    <div className="bg-surface p-2 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-medium">Avg Score</span>
                      <span className="text-xs font-bold text-amber-400">{st.avg_score}/100</span>
                    </div>
                    <div className="bg-surface p-2 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-medium">Avg Progress</span>
                      <span className="text-xs font-bold text-emerald-400">{st.avg_progress}%</span>
                    </div>
                    <div className="bg-surface p-2 rounded-xl">
                      <span className="block text-[10px] text-gray-400 font-medium">Executions</span>
                      <span className="text-xs font-bold text-blue-400">{st.compiler_runs}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(st)}
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl font-semibold transition-all text-xs flex items-center justify-center gap-1 mt-2"
                >
                  <span>View Full Profile & Sessions</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Student History Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-card border border-border rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedStudent.name}</h2>
                    <span className="font-mono text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-semibold">
                      {selectedStudent.roll_number}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {selectedStudent.department} • {selectedStudent.year} Year (Sec {selectedStudent.section})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1 text-gray-400 hover:text-white bg-surface hover:bg-surface-hover rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Overall Performance Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400">Total Sessions</span>
                  <p className="text-lg font-bold text-white">{selectedStudent.total_sessions}</p>
                </div>
                <div className="bg-surface p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400">Average Score</span>
                  <p className="text-lg font-bold text-amber-400">{selectedStudent.avg_score} / 100</p>
                </div>
                <div className="bg-surface p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400">Average Progress</span>
                  <p className="text-lg font-bold text-emerald-400">{selectedStudent.avg_progress}%</p>
                </div>
                <div className="bg-surface p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-gray-400">Successful Executions</span>
                  <p className="text-lg font-bold text-blue-400">{selectedStudent.successful_runs} / {selectedStudent.compiler_runs}</p>
                </div>
              </div>

              {/* Session History Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Session History</span>
                </h3>

                <div className="overflow-x-auto border border-border/60 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-gray-400 uppercase tracking-wider text-[10px] bg-surface/50">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Session Title</th>
                        <th className="py-2.5 px-3">Language</th>
                        <th className="py-2.5 px-3">Progress</th>
                        <th className="py-2.5 px-3">Score</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-gray-300">
                      {(selectedStudent.sessions || []).map((s, idx) => (
                        <tr key={idx} className="hover:bg-surface-hover/50">
                          <td className="py-2.5 px-3 whitespace-nowrap text-gray-400">
                            {s.date ? new Date(s.date).toLocaleDateString('en-GB') : 'N/A'}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">{s.session_title}</td>
                          <td className="py-2.5 px-3 uppercase text-[10px] font-bold">{s.language}</td>
                          <td className="py-2.5 px-3 font-medium text-emerald-400">{s.progress}%</td>
                          <td className="py-2.5 px-3 font-medium text-amber-400">{s.score}/100</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {s.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
