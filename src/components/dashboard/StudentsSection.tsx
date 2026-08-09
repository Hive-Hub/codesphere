import React, { useState } from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { Student } from '../../types/student';
import { StudentDetailDrawer } from '../teacher/StudentDetailDrawer';
import { Search, Filter, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export const StudentsSection: React.FC<{ language?: string }> = ({ language = 'python' }) => {
  const { students, setSelectedStudent, selectedStudent } = useTeacherStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : student.status === statusFilter || (statusFilter === 'online' && student.status === 'typing');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
          </select>
        </div>
      </div>

      {/* Live Student Table */}
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/80 text-gray-400 uppercase text-[11px] font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Progress</th>
                <th className="px-6 py-3.5">Typing</th>
                <th className="px-6 py-3.5">Code Quality</th>
                <th className="px-6 py-3.5">AI Score</th>
                <th className="px-6 py-3.5">Executions</th>
                <th className="px-6 py-3.5">Errors</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                    No students found in this session yet.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudent(st)}
                    className="hover:bg-surface-hover/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{st.name}</span>
                          {st.is_stuck && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Stuck!" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-normal block">{st.department}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-gray-300 text-xs">{st.roll_number}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          st.status === 'online' || st.status === 'typing'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          st.status === 'online' || st.status === 'typing' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                        }`} />
                        {st.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-300 font-semibold">{st.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all"
                            style={{ width: `${st.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {st.is_typing ? (
                        <span className="text-xs text-indigo-400 font-semibold animate-pulse">Typing...</span>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-emerald-400 font-semibold">{st.code_quality ?? 85}</td>

                    <td className="px-6 py-4 text-amber-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {st.ai_score ?? 90}
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono text-xs">{st.executions_count || 0}</td>

                    <td className="px-6 py-4 text-rose-400 font-mono text-xs">{st.errors_count || 0}</td>

                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Slide-Over Drawer */}
      <StudentDetailDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        language={language}
      />
    </div>
  );
};
