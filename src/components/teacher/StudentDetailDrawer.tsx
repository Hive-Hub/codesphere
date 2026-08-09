import React from 'react';
import { Student } from '../../types/student';
import { X, User, Code, AlertTriangle, Cpu, Activity, CheckCircle, Clock } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface StudentDetailDrawerProps {
  student: Student | null;
  onClose: () => void;
  language?: string;
}

export const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  student,
  onClose,
  language = 'python',
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-surface border-l border-border h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{student.name}</h2>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  student.status === 'online' || student.status === 'typing'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                }`}>
                  {student.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400">Roll: {student.roll_number} | {student.department} {student.section}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-card p-4 rounded-xl border border-border text-center">
              <span className="text-xs text-gray-400 font-medium">Progress</span>
              <p className="text-xl font-bold text-indigo-400 mt-1">{student.progress ?? 0}%</p>
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${student.progress ?? 0}%` }}
                />
              </div>
            </div>

            <div className="bg-surface-card p-4 rounded-xl border border-border text-center">
              <span className="text-xs text-gray-400 font-medium">Code Quality</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{student.code_quality ?? 85}</p>
            </div>

            <div className="bg-surface-card p-4 rounded-xl border border-border text-center">
              <span className="text-xs text-gray-400 font-medium">AI Score</span>
              <p className="text-xl font-bold text-cyan-400 mt-1">{student.ai_score ?? 90}</p>
            </div>
          </div>

          {/* Status Banners */}
          {student.is_stuck && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold">Student Needs Attention</p>
                <p className="text-rose-300/80">Multiple repeated errors or stalled code progress detected by AI.</p>
              </div>
            </div>
          )}

          {/* Student Live Code Preview (Read-Only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                Live Code Snapshot (Read-Only)
              </h3>
              {student.cursor_line && (
                <span className="text-xs text-gray-400 font-mono">
                  Line {student.cursor_line}, Col {student.cursor_column || 1}
                </span>
              )}
            </div>
            <div className="h-64 border border-border rounded-xl overflow-hidden bg-background">
              <Editor
                height="100%"
                language={language.toLowerCase()}
                theme="vs-dark"
                value={student.current_code || '# No code submitted yet'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: 'Fira Code',
                }}
              />
            </div>
          </div>

          {/* Executions Stats */}
          <div className="bg-surface-card p-4 rounded-xl border border-border space-y-3">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Compiler Activity
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
                <span className="text-gray-400">Total Runs:</span>
                <span className="font-bold text-white">{student.executions_count || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface">
                <span className="text-gray-400">Compiler Errors:</span>
                <span className="font-bold text-rose-400">{student.errors_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
