import React, { useState, useEffect } from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { teacherApi } from '../../services/teacherApi';
import { useSessionStore } from '../../store/sessionStore';
import Editor from '@monaco-editor/react';
import { Code, Terminal, User, Cpu, AlertCircle } from 'lucide-react';

export const CodeCompilerSection: React.FC<{ language?: string }> = ({ language = 'python' }) => {
  const { students, updateStudentCode } = useTeacherStore();
  const { session } = useSessionStore();
  const sessionId = session?.id;

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    students[0]?.id || null
  );

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Fetch initial student code via REST when selected student changes
  useEffect(() => {
    if (!sessionId || !activeStudent?.id) return;
    teacherApi.getStudentDetails(sessionId, activeStudent.id).then((res) => {
      if (res.success && res.data?.code?.code) {
        updateStudentCode(activeStudent.id, res.data.code.code);
      }
    }).catch(() => {
      // Ignore error fallback
    });
  }, [sessionId, activeStudent?.id]);

  const activeCode = activeStudent?.current_code || activeStudent?.code || '# No code written yet by student';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Student Selector Bar */}
      <div className="bg-surface-card p-4 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <User className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-gray-200">Select Student Code:</span>
          <select
            value={activeStudent?.id || ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.roll_number}) — {(st.status || 'offline').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {activeStudent && (
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <span>
              Cursor: <strong className="text-indigo-400">Ln {activeStudent.cursor_line || 1}, Col {activeStudent.cursor_column || 1}</strong>
            </span>
            <span>Language: <strong className="text-emerald-400 capitalize">{language}</strong></span>
          </div>
        )}
      </div>

      {!activeStudent ? (
        <div className="bg-surface-card p-12 rounded-xl border border-border text-center text-gray-400">
          <AlertCircle className="w-8 h-8 mx-auto text-gray-500 mb-2" />
          No student selected or no active students in classroom.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Read-Only Monaco Editor Container */}
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="bg-surface px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>{activeStudent.name}'s Live Editor (Read-Only)</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                Live Socket Sync
              </span>
            </div>

            <div className="flex-1 bg-background">
              <Editor
                height="100%"
                language={language.toLowerCase()}
                theme="vs-dark"
                value={activeCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  fontFamily: 'Fira Code',
                }}
              />
            </div>
          </div>

          {/* Compiler Status & Console Output Container */}
          <div className="bg-surface-card border border-border rounded-2xl p-6 flex flex-col h-[500px] justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Compiler Execution Log</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  Runs: {activeStudent.executions_count || 0}
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Last Execution Status:</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {(activeStudent.last_execution_status || 'READY').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Code Quality Score:</span>
                    <span className="font-mono font-semibold text-indigo-400">
                      {activeStudent.code_quality || 100}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">AI Progress Score:</span>
                    <span className="font-mono font-semibold text-cyan-400">
                      {activeStudent.ai_score || 100}/100
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-xl border border-border font-mono text-xs text-gray-300 h-60 overflow-y-auto">
                  <span className="text-gray-500 block mb-2">// Live compiler output log for {activeStudent.name}:</span>
                  <pre className="whitespace-pre-wrap text-emerald-400">
                    {activeStudent.last_output || '// Student has not executed code yet.'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
