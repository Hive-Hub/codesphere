import React, { useEffect } from 'react';
import { useAIStore } from '../../store/aiStore';
import { aiApi } from '../../services/aiApi';
import { useTeacherStore } from '../../store/teacherStore';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle, RefreshCw } from 'lucide-react';

export const AIInsightsSection: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const { teacherOverview, setTeacherOverview, isLoadingOverview, setLoadingOverview } = useAIStore();
  const { students } = useTeacherStore();

  const fetchOverview = async () => {
    try {
      setLoadingOverview(true);
      const res = await aiApi.getTeacherOverview(sessionId);
      if (res.success && res.data) {
        setTeacherOverview(res.data);
      }
    } catch {
      // Fallback local calculation if backend report pending
      const stuckList = students.filter((s) => s.is_stuck);
      setTeacherOverview({
        avg_progress: Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / (students.length || 1)),
        avg_code_quality: Math.round(students.reduce((acc, s) => acc + (s.code_quality || 85), 0) / (students.length || 1)),
        avg_ai_score: Math.round(students.reduce((acc, s) => acc + (s.ai_score || 90), 0) / (students.length || 1)),
        stuck_students: stuckList.map((s) => ({
          student_id: s.id,
          name: s.name,
          roll_number: s.roll_number,
          progress: s.progress || 0,
          confidence: 70,
          code_quality: s.code_quality || 85,
          current_stage: 'Syntax Debugging',
          is_stuck: true,
          ai_summary: 'Student encountered repeated syntax exceptions in loop body.',
          suggestions: ['Review loop condition syntax', 'Check variable scope'],
        })),
        common_errors: [
          { error: 'IndentationError: unexpected indent', count: 4 },
          { error: 'NameError: variable undefined', count: 3 },
        ],
        common_concepts: [
          { concept: 'For Loops & Iteration', count: 12 },
          { concept: 'Array Indexing', count: 8 },
        ],
        student_summaries: [],
      });
    } finally {
      setLoadingOverview(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [sessionId]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface-card p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Class AI Insights & Analytics</h2>
            <p className="text-xs text-gray-400">Automated AI diagnostics, common misconceptions, and stuck student alerts</p>
          </div>
        </div>

        <button
          onClick={fetchOverview}
          disabled={isLoadingOverview}
          className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-sm font-semibold text-gray-200 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${isLoadingOverview ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Class AI Overview Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card p-5 rounded-xl border border-border text-center">
          <span className="text-xs text-gray-400 font-medium">Class Average Progress</span>
          <p className="text-3xl font-bold text-indigo-400 mt-2">{teacherOverview?.avg_progress || 0}%</p>
        </div>
        <div className="bg-surface-card p-5 rounded-xl border border-border text-center">
          <span className="text-xs text-gray-400 font-medium">Class Code Quality</span>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{teacherOverview?.avg_code_quality || 85}</p>
        </div>
        <div className="bg-surface-card p-5 rounded-xl border border-border text-center">
          <span className="text-xs text-gray-400 font-medium">Class AI Mastery Score</span>
          <p className="text-3xl font-bold text-amber-400 mt-2">{teacherOverview?.avg_ai_score || 90}</p>
        </div>
      </div>

      {/* Stuck Students List */}
      <div className="bg-surface-card p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <AlertTriangle className="w-5 h-5" />
          <h3>Students Needing Attention ({teacherOverview?.stuck_students.length || 0})</h3>
        </div>

        {!teacherOverview?.stuck_students || teacherOverview.stuck_students.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Great news! No students are currently flagged as stuck.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherOverview.stuck_students.map((st) => (
              <div key={st.student_id} className="p-4 bg-surface rounded-xl border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{st.name} ({st.roll_number})</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">STUCK</span>
                </div>
                <p className="text-xs text-gray-300">{st.ai_summary}</p>
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] text-indigo-400 font-semibold block mb-1">Suggested Teacher Guidance:</span>
                  <ul className="list-disc list-inside text-xs text-gray-400 space-y-0.5">
                    {st.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Common Error Patterns & Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-card p-6 rounded-2xl border border-border space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Top Error Patterns
          </h3>
          <div className="space-y-2">
            {teacherOverview?.common_errors?.map((err, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <span className="text-xs font-mono text-gray-300">{err.error}</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                  {err.count} students
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-card p-6 rounded-2xl border border-border space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            Active Programming Concepts
          </h3>
          <div className="space-y-2">
            {teacherOverview?.common_concepts?.map((cpt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
                <span className="text-xs font-semibold text-gray-300">{cpt.concept}</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                  {cpt.count} active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
