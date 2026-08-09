import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { FinalReportSection } from '../../components/dashboard/FinalReportSection';
import { ArrowLeft } from 'lucide-react';

export const TeacherReportPage: React.FC = () => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const sessionId = parseInt(paramSessionId || '1', 10);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <Link
          to={`/teacher/dashboard/${sessionId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Live Dashboard
        </Link>
        <FinalReportSection sessionId={sessionId} />
      </main>
    </div>
  );
};
