import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeacherSession } from '../../hooks/useTeacherSession';
import { useSocket } from '../../hooks/useSocket';
import { useSessionStore } from '../../store/sessionStore';
import { Header } from '../../components/common/Header';
import { DebugPanel } from '../../components/common/DebugPanel';
import { OverviewSection } from '../../components/dashboard/OverviewSection';
import { StudentsSection } from '../../components/dashboard/StudentsSection';
import { LiveActivitySection } from '../../components/dashboard/LiveActivitySection';
import { CodeCompilerSection } from '../../components/dashboard/CodeCompilerSection';
import { AIInsightsSection } from '../../components/dashboard/AIInsightsSection';
import { FinalReportSection } from '../../components/dashboard/FinalReportSection';
import { ProblemModal } from '../../components/teacher/ProblemModal';
import { LayoutDashboard, Users, Activity, Code, Sparkles, FileText, AlertCircle, BookOpen } from 'lucide-react';

export type DashboardTab = 'overview' | 'students' | 'activity' | 'code' | 'ai' | 'report';

export const TeacherDashboardPage: React.FC = () => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const sessionId = parseInt(paramSessionId || '1', 10);

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [showProblemModal, setShowProblemModal] = useState<boolean>(false);

  const { error, refetchDashboard, reconcile } = useTeacherSession(sessionId);
  const { session, problem, setProblem } = useSessionStore();

  // Socket connection for teacher role — sets up all event listeners
  useSocket(sessionId, 'teacher');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'activity', label: 'Live Activity', icon: Activity },
    { id: 'code', label: 'Code & Compiler', icon: Code },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
    { id: 'report', label: 'Final Report', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <Header />

      {/* Main Dashboard Navigation Tabs */}
      <div className="bg-surface/80 border-b border-border sticky top-[65px] z-30 backdrop-blur-md px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto py-2 no-scrollbar">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-gray-400 hover:text-white hover:bg-surface-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Configure Problem Button for Problem Solving Mode */}
          {session?.mode === 'problem_solving' && (
            <button
              onClick={() => setShowProblemModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{problem ? 'Edit Problem' : 'Configure Problem'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full">
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={refetchDashboard}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-xs text-rose-300 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'students' && <StudentsSection language={session?.language} />}
        {activeTab === 'activity' && <LiveActivitySection />}
        {activeTab === 'code' && <CodeCompilerSection language={session?.language} />}
        {activeTab === 'ai' && <AIInsightsSection sessionId={sessionId} />}
        {activeTab === 'report' && <FinalReportSection sessionId={sessionId} />}
      </main>

      {/* Problem Modal */}
      <ProblemModal
        isOpen={showProblemModal}
        onClose={() => setShowProblemModal(false)}
        sessionId={sessionId}
        existingProblem={problem}
        onProblemSaved={(updatedProblem) => setProblem(updatedProblem)}
      />

      {/* Debug Panel (dev only) */}
      <DebugPanel />
    </div>
  );
};
