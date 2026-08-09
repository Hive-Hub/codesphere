import React from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { Activity, UserCheck, UserX, Code, Cpu, Sparkles, AlertCircle } from 'lucide-react';

export const LiveActivitySection: React.FC = () => {
  const { activityFeed } = useTeacherStore();

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'presence':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-indigo-400" />;
      case 'compiler':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-surface-card p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live Activity Feed</h2>
              <p className="text-xs text-gray-400">Real-time classroom events broadcast via Socket.IO</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            {activityFeed.length} Events Logged
          </span>
        </div>

        {activityFeed.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-gray-500" />
            <p className="text-sm">No live events logged yet.</p>
            <p className="text-xs text-gray-500">Activity will stream automatically as students code and compile.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {activityFeed.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border/70 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface-card border border-border">
                    {getEventIcon(item.category)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.message}</p>
                    {item.student_name && (
                      <span className="text-xs text-gray-400">Student: {item.student_name}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-500">{item.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
