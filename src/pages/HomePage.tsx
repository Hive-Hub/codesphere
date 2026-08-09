import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import {
  Terminal,
  Users,
  GraduationCap,
  Sparkles,
  Code2,
  ShieldCheck,
  ArrowRight,
  Zap,
  Cpu,
  FileCheck,
  Activity,
  CheckCircle2,
  Award,
  Globe,
  Heart,
  Github,
  Layers,
  Clock,
  BookOpen
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center">
        
        {/* ========================================================================= */}
        {/* HERO SECTION WITH DYNAMIC GLASSMORPHISM & REAL-TIME BADGE                 */}
        {/* ========================================================================= */}
        <section className="relative w-full max-w-7xl px-4 py-16 md:py-24 flex flex-col items-center text-center overflow-hidden">
          {/* Subtle Ambient Gradient Glow Backdrop */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute top-48 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in shadow-lg shadow-indigo-500/5">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Next-Gen Real-Time Coding Classroom & AI Analytics</span>
          </div>

          {/* Hero Title & Subtitle */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl leading-[1.15]">
            Transform Code Instruction with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Live AI Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-gray-300 mt-4 max-w-3xl">
            Real-Time Student Code Sync • Sandboxed Compiler • Automated AI Diagnostics
          </p>

          <p className="text-gray-400 max-w-2xl text-sm sm:text-base mt-4 leading-relaxed">
            CodeSphere AI bridges the gap between students and teachers in computer science labs. Inspect live Monaco Editor cursors, monitor execution runs, detect stuck students instantly, and generate PDF/Excel classroom reports.
          </p>

          {/* Real-time Metrics Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-10">
            <div className="p-4 bg-surface-card/60 backdrop-blur-md rounded-2xl border border-border/80 text-center">
              <span className="text-2xl font-bold font-mono text-indigo-400">100%</span>
              <span className="text-xs text-gray-400 block mt-0.5">Real-Time Sync</span>
            </div>
            <div className="p-4 bg-surface-card/60 backdrop-blur-md rounded-2xl border border-border/80 text-center">
              <span className="text-2xl font-bold font-mono text-emerald-400">&lt;50ms</span>
              <span className="text-xs text-gray-400 block mt-0.5">Socket.IO Latency</span>
            </div>
            <div className="p-4 bg-surface-card/60 backdrop-blur-md rounded-2xl border border-border/80 text-center">
              <span className="text-2xl font-bold font-mono text-cyan-400">3 Languages</span>
              <span className="text-xs text-gray-400 block mt-0.5">Python • C • Java</span>
            </div>
            <div className="p-4 bg-surface-card/60 backdrop-blur-md rounded-2xl border border-border/80 text-center">
              <span className="text-2xl font-bold font-mono text-amber-400">AI Powered</span>
              <span className="text-xs text-gray-400 block mt-0.5">Automated Diagnostics</span>
            </div>
          </div>

          {/* Role Selection Portals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-14 text-left">
            {/* Teacher Card */}
            <div className="relative group p-8 rounded-3xl bg-surface-card/80 backdrop-blur-xl border border-border/80 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">For Instructors & TAs</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Teacher Portal</h2>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Launch practice or problem-solving sessions with a 6-digit session PIN. View live student rosters, read-only Monaco Editor views, activity feeds, and download binary PDF & Excel classroom reports.
                </p>
              </div>

              <Link
                to="/teacher"
                className="relative z-10 inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/25 group-hover:gap-3"
              >
                <span>Create Classroom Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Student Card */}
            <div className="relative group p-8 rounded-3xl bg-surface-card/80 backdrop-blur-xl border border-border/80 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">For Students & Learners</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Student Portal</h2>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Enter a 6-digit PIN to join your lab session. Code with Monaco Editor syntax highlighting, execute in sandboxed compilers, access guided AI hints, and maintain offline code backups automatically.
                </p>
              </div>

              <Link
                to="/student"
                className="relative z-10 inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 group-hover:gap-3"
              >
                <span>Join Coding Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ABOUT ME & PLATFORM VISION SECTION                                       */}
        {/* ========================================================================= */}
        <section className="w-full bg-surface-card/50 border-y border-border/60 py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Platform Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>About CodeSphere AI</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Designed to Re-engineer Computer Science Education
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Traditional programming labs rely on static submissions or manual email collection, creating a disconnect between teachers and struggling students. CodeSphere AI was built to turn coding instruction into an interactive, transparent, real-time experience.
              </p>

              <p className="text-gray-400 text-sm leading-relaxed">
                Every keystroke, compiler error, and activity event is synchronized across Socket.IO session channels, empowering instructors to spot stuck students before they fall behind while providing students with contextual AI hints.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border/60">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Zero Black-Box Labs</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Teachers see live cursor positions and compiler stdout in real time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border/60">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Guided AI Assistance</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Provides guided hints without giving away complete solutions in problem mode.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Creator / Developer Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-surface-card to-background border border-border shadow-2xl relative overflow-hidden space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-2xl shadow-inner">
                  <Code2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Meet the Architect</span>
                  <h3 className="text-2xl font-bold text-white">Built by Thirunavukkarasu</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Full-Stack Developer & Real-Time Systems Engineer passionate about high-performance educational platforms, distributed web sockets, and intelligent developer tooling.
                  </p>
                </div>

                <div className="p-4 bg-surface rounded-xl border border-border/60 space-y-2 text-xs font-mono text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Backend:</span>
                    <span className="text-indigo-400">Python Flask & Socket.IO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frontend:</span>
                    <span className="text-emerald-400">React 18 & TypeScript</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Editor:</span>
                    <span className="text-cyan-400">Monaco Engine</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Database:</span>
                    <span className="text-amber-400">PostgreSQL & Redis</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href="https://github.com/Hive-Hub/codesphere"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-hover text-white rounded-xl text-xs font-semibold border border-border transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repo</span>
                  </a>
                  <span className="text-[11px] text-gray-500 font-mono">v1.0.0 Production</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3-STEP WORKFLOW WALKTHROUGH                                               */}
        {/* ========================================================================= */}
        <section className="w-full max-w-6xl px-4 py-20 flex flex-col items-center">
          <div className="text-center max-w-2xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Seamless Classroom Setup</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">How CodeSphere AI Works</h2>
            <p className="text-sm text-gray-400 mt-2">
              Get your entire coding lab connected in under 30 seconds with no complex account registration required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-indigo-600/30">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Create Session</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Teacher fills in subject details, selects Python, C, or Java, and chooses Practice or Problem Solving mode to generate a 6-digit session PIN.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-emerald-600/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Students Join & Code</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Students enter the 6-digit code with their name and roll number. Monaco Editor streams live code edits, typing indicators, and cursor movements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border/80 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-cyan-600/30">
                03
              </div>
              <h3 className="text-lg font-bold text-white">AI Diagnostics & Reports</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                AI monitors class progress, alerts teachers to stuck students, tracks anti-cheat events, and compiles downloadable PDF & Excel reports upon session completion.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURE BENTO GRID                                                        */}
        {/* ========================================================================= */}
        <section className="w-full max-w-6xl px-4 py-16 border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Engineered for Production</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Comprehensive Platform Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3">
              <Terminal className="w-6 h-6 text-indigo-400" />
              <h4 className="text-base font-bold text-white">Monaco Editor Engine</h4>
              <p className="text-xs text-gray-400 leading-relaxed">VS Code powered editor with syntax highlighting, indentation, and custom keyboard shortcuts for Python, C, and Java.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Anti-Cheat Activity Tracking</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Detects copy, paste, cut, tab blur, and tab focus events, recording non-destructive activity warnings on the teacher timeline.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3">
              <FileCheck className="w-6 h-6 text-cyan-400" />
              <h4 className="text-base font-bold text-white">Binary PDF & Excel Reports</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Generates comprehensive post-session digital reports containing student execution counts, AI scores, and code snapshots.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">Context-Aware AI Guidance</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Provides targeted hint generation, syntax error explanations, and code reviews while enforcing problem-mode solution restrictions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3">
              <Layers className="w-6 h-6 text-rose-400" />
              <h4 className="text-base font-bold text-white">Offline Local Draft Recovery</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Automatically backs up student code to localStorage on every edit, guaranteeing zero data loss during network drops.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3">
              <Clock className="w-6 h-6 text-purple-400" />
              <h4 className="text-base font-bold text-white">Automated Session Expiration</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Sessions auto-expire after 24 hours, locking student workspaces to read-only state and initiating automated report generation.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="w-full border-t border-border/80 bg-surface-card/40 py-8 px-4 text-center text-xs text-gray-400 space-y-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">CodeSphere AI</span>
            <span>•</span>
            <span>Intelligent Real-Time Coding Classroom</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Production Backend Connected</span>
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/40 text-[11px] text-gray-500 flex items-center justify-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>by Thirunavukkarasu for CS Instructors & Students.</span>
        </div>
      </footer>
    </div>
  );
};
