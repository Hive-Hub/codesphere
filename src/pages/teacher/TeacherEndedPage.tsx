import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { CheckCircle2, Home, FileText } from 'lucide-react';

export const TeacherEndedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-md mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="bg-surface-card border border-border rounded-3xl p-8 shadow-2xl space-y-6 w-full">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Session Ended</h1>
            <p className="text-sm text-gray-400 mt-2">
              The coding classroom session has concluded. Session data has been compiled.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link
              to="/"
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
