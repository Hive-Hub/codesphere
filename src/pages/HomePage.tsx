import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Terminal, Users, GraduationCap, Sparkles, Code2, ShieldCheck, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center justify-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Coding Analytics & AI Diagnostics</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
          CodeSphere AI
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-indigo-400 mt-2">
          Intelligent Real-Time Coding Classroom
        </p>
        <p className="text-gray-400 max-w-2xl text-base sm:text-lg mt-4 leading-relaxed">
          A live coding classroom where teachers can monitor student progress, coding activity, compiler results, and AI-powered insights in real time.
        </p>

        {/* Two Main Role Cards: Teacher & Student */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-12 text-left">
          {/* Teacher Card */}
          <div className="glass-card p-8 rounded-3xl border border-border/80 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">Teacher Portal</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Create and manage a live coding session. Monitor live student editor cursors, compiler output, and automated AI diagnostic summaries.
              </p>
            </div>

            <Link
              to="/teacher"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 group-hover:gap-3"
            >
              <span>Create Classroom Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Student Card */}
          <div className="glass-card p-8 rounded-3xl border border-border/80 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 group flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-white">Student Portal</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Join a coding classroom using a 6-digit session code. Write, run, and debug Python, C, or Java code with instant AI guidance.
              </p>
            </div>

            <Link
              to="/student"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20 group-hover:gap-3"
            >
              <span>Join Coding Classroom</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Technical Features Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-16 text-left border-t border-border/60 pt-8">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <span className="text-xs text-gray-400 font-medium">Multi-language: Python, C, Java</span>
          </div>
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs text-gray-400 font-medium">Monaco Editor & Sandboxed Compiler</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span className="text-xs text-gray-400 font-medium">Socket.IO Real-Time Sync</span>
          </div>
        </div>
      </main>
    </div>
  );
};
