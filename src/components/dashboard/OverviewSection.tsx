import React from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { useSessionStore } from '../../store/sessionStore';
import { Users, Wifi, Clock, Code, Cpu, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const OverviewSection: React.FC = () => {
  const { metrics, students } = useTeacherStore();
  const { session } = useSessionStore();

  const safeStudents = students || [];
  const safeMetrics = metrics || {
    total_students: 0,
    online_students: 0,
    offline_students: 0,
    avg_progress: 0,
    avg_ai_score: 0,
    total_executions: 0,
    successful_executions: 0,
    failed_executions: 0,
  };

  const progressDistributionData = [
    { name: '0-25%', count: safeStudents.filter((s) => (s.progress || 0) <= 25).length },
    { name: '26-50%', count: safeStudents.filter((s) => (s.progress || 0) > 25 && (s.progress || 0) <= 50).length },
    { name: '51-75%', count: safeStudents.filter((s) => (s.progress || 0) > 50 && (s.progress || 0) <= 75).length },
    { name: '76-100%', count: safeStudents.filter((s) => (s.progress || 0) > 75).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Session Header Card */}
      <div className="bg-surface-card p-6 rounded-2xl border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Live Classroom Session</span>
          <h2 className="text-2xl font-bold text-white mt-1">{session?.title || 'Coding Classroom Session'}</h2>
          <p className="text-sm text-gray-400 mt-1">
            Teacher: <span className="text-gray-200 font-medium">{session?.teacher_name || 'Teacher'}</span> ({session?.teacher_email || 'N/A'})
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {session?.college || 'Institution'} • {session?.department || 'Department'} • {session?.subject || 'Subject'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-surface rounded-xl border border-border text-center">
            <span className="text-xs text-gray-400 block">Session Code</span>
            <span className="text-lg font-bold font-mono text-indigo-400 tracking-wider">{session?.session_code || '------'}</span>
          </div>
          <div className="px-4 py-2 bg-surface rounded-xl border border-border text-center">
            <span className="text-xs text-gray-400 block">Language</span>
            <span className="text-sm font-semibold capitalize text-white">{session?.language || 'python'}</span>
          </div>
          <div className="px-4 py-2 bg-surface rounded-xl border border-border text-center">
            <span className="text-xs text-gray-400 block">Mode</span>
            <span className="text-sm font-semibold capitalize text-white">{session?.mode?.replace('_', ' ') || 'practice'}</span>
          </div>
        </div>
      </div>

      {/* Top 8 Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{safeMetrics.total_students ?? 0}</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Online</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{safeMetrics.online_students ?? 0}</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Avg Progress</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">{safeMetrics.avg_progress ?? 0}%</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Avg AI Score</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{safeMetrics.avg_ai_score ?? 100}</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Runs</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{safeMetrics.total_executions ?? 0}</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Successful Runs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{safeMetrics.successful_executions ?? 0}</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Failed Runs</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 mt-2">{safeMetrics.failed_executions ?? 0}</p>
        </div>

        <div className="bg-surface-card p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Offline</span>
            <Users className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-400 mt-2">{safeMetrics.offline_students ?? 0}</p>
        </div>
      </div>

      {/* Progress Distribution Chart */}
      <div className="bg-surface-card p-6 rounded-2xl border border-border space-y-4">
        <h3 className="text-base font-semibold text-white">Student Progress Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressDistributionData}>
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: '#1F293D', borderRadius: '8px', color: '#FFF' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {progressDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366F1', '#06B6D4', '#10B981', '#F59E0B'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
