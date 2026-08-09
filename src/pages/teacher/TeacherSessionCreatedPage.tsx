import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../store/sessionStore';
import { Header } from '../../components/common/Header';
import { CheckCircle2, Copy, Check, ArrowRight, BookOpen, Layers, User } from 'lucide-react';

export const TeacherSessionCreatedPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSessionStore();
  const [copied, setCopied] = useState<boolean>(false);

  const sessionCode = session?.session_code || '483921';
  const codeDigits = sessionCode.split('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleEnterDashboard = () => {
    if (session?.id) {
      navigate(`/teacher/dashboard/${session.id}`);
    } else {
      navigate('/teacher/dashboard/1');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="bg-surface-card border border-border rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 w-full">
          {/* Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Success</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">SESSION CREATED</h1>
            <p className="text-sm text-gray-400 mt-2">
              Share this 6-digit session code with your students to join the classroom.
            </p>
          </div>

          {/* Large Stylized 6-Digit Code Display */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-4">
            {codeDigits.map((digit, idx) => (
              <div
                key={idx}
                className="w-12 h-16 sm:w-16 sm:h-20 bg-surface border-2 border-indigo-500/40 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400 shadow-xl shadow-indigo-500/10"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-surface hover:bg-surface-hover border border-border rounded-xl text-sm font-semibold text-gray-200 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-indigo-400" />
                <span>Copy Session Code</span>
              </>
            )}
          </button>

          {/* Session Summary Metadata */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-surface rounded-2xl border border-border text-xs">
            <div>
              <span className="text-gray-400 block">Teacher</span>
              <span className="font-semibold text-white truncate block">{session?.teacher_name || 'Teacher'}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Language</span>
              <span className="font-semibold text-white capitalize">{session?.language || 'python'}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Mode</span>
              <span className="font-semibold text-white capitalize">{session?.mode.replace('_', ' ') || 'practice'}</span>
            </div>
          </div>

          {/* Enter Live Dashboard Action */}
          <button
            onClick={handleEnterDashboard}
            className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <span>Enter Live Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};
