import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { LiveClassroomSimulation } from '../components/home/LiveClassroomSimulation';
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
  BookOpen,
  User,
  Brain,
  Shield,
  Database,
  Star,
  TrendingUp,
  Lock,
  MessageSquare
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center">
        
        {/* ========================================================================= */}
        {/* HERO SECTION WITH 3D DEPTH GLASSMORPHISM & AMBIENT FLOATING ELEMENTS      */}
        {/* ========================================================================= */}
        <section className="relative w-full max-w-7xl px-4 py-16 md:py-24 flex flex-col items-center text-center overflow-hidden perspective-1000">
          {/* 3D Dynamic Ambient Lighting & Floating Orbs */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />
          <div className="absolute top-48 right-10 w-[350px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-float" />
          <div className="absolute top-72 left-10 w-[300px] h-[300px] bg-cyan-500/15 blur-[110px] rounded-full pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />

          {/* Hero Startup Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xl shadow-indigo-500/10 animate-float">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Next-Gen Real-Time Coding Classroom & AI Telemetry Engine</span>
          </div>

          {/* Hero Title & Subtitle with 3D Depth Styling */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl leading-[1.15] drop-shadow-2xl">
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

          {/* 3D Real-time Metrics Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-10">
            <div className="p-4 bg-surface-card/70 backdrop-blur-md rounded-2xl border border-border/80 text-center shadow-xl card-3d-tilt">
              <span className="text-2xl font-bold font-mono text-indigo-400">100%</span>
              <span className="text-xs text-gray-400 block mt-0.5">Real-Time Sync</span>
            </div>
            <div className="p-4 bg-surface-card/70 backdrop-blur-md rounded-2xl border border-border/80 text-center shadow-xl card-3d-tilt">
              <span className="text-2xl font-bold font-mono text-emerald-400">&lt;50ms</span>
              <span className="text-xs text-gray-400 block mt-0.5">Socket.IO Latency</span>
            </div>
            <div className="p-4 bg-surface-card/70 backdrop-blur-md rounded-2xl border border-border/80 text-center shadow-xl card-3d-tilt">
              <span className="text-2xl font-bold font-mono text-cyan-400">3 Languages</span>
              <span className="text-xs text-gray-400 block mt-0.5">Python • C • Java</span>
            </div>
            <div className="p-4 bg-surface-card/70 backdrop-blur-md rounded-2xl border border-border/80 text-center shadow-xl card-3d-tilt">
              <span className="text-2xl font-bold font-mono text-amber-400">AI Powered</span>
              <span className="text-xs text-gray-400 block mt-0.5">Automated Diagnostics</span>
            </div>
          </div>

          {/* 3D Role Selection Portals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-14 text-left">
            {/* Teacher 3D Portal Card */}
            <div className="relative group p-8 rounded-3xl bg-surface-card/90 backdrop-blur-xl border border-border/80 hover:border-indigo-500/60 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/20 card-3d-tilt flex flex-col justify-between space-y-6">
              <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all pointer-events-none" />
              
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
                className="relative z-10 inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 group-hover:gap-3"
              >
                <span>Create Classroom Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Student 3D Portal Card */}
            <div className="relative group p-8 rounded-3xl bg-surface-card/90 backdrop-blur-xl border border-border/80 hover:border-emerald-500/60 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/20 card-3d-tilt flex flex-col justify-between space-y-6">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition-all pointer-events-none" />

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
                className="relative z-10 inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-xl shadow-emerald-600/30 group-hover:gap-3"
              >
                <span>Join Coding Classroom</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE ANIMATED CLASSROOM MATRIX SHOWCASE (MOVIE TICKET STYLE DESKS GRID)   */}
        {/* ========================================================================= */}
        <section className="w-full max-w-7xl px-4 py-12">
          <LiveClassroomSimulation />
        </section>

        {/* ========================================================================= */}
        {/* DEDICATED "ABOUT ME" SECTION FOR SEKHAR (3D PORTRAIT CARD & BENTO TILES)  */}
        {/* ========================================================================= */}
        <section className="w-full bg-gradient-to-b from-surface-card/90 via-background to-background border-t border-border/80 py-24 px-4 relative overflow-hidden perspective-1000">
          {/* Ambient Lighting Backdrops */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Ultra-Modern 3D Edge-to-Edge Portrait Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm sm:max-w-md card-3d-tilt">
                {/* Glowing Outer Frame Gradient */}
                <div className="absolute -inset-2.5 bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 rounded-[34px] blur-xl opacity-60 group-hover:opacity-90 transition duration-700 animate-pulse-slow" />
                
                {/* Image Container Card */}
                <div className="relative rounded-[28px] overflow-hidden border border-indigo-500/30 bg-slate-950 shadow-2xl aspect-[3/4]">
                  <img
                    src="/sekhar.jpg"
                    alt="Sekhar - B.Tech Data Science Student"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Overlay at Bottom for Overlay Info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent p-6 pt-16 flex flex-col justify-end text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        B.Tech Data Science Student
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-white tracking-tight">Sekhar</h3>
                    <p className="text-xs text-gray-300 font-medium">
                      AI • Software Dev • Cybersecurity • Real-World Projects
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sekhar's Exact Bio & 3D Interactive Bento Skill Grid */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Developer & Founder Profile</span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  About Me
                </h2>

                <div className="space-y-4 text-gray-200 text-base sm:text-lg leading-relaxed">
                  <p>
                    Hi, I’m <strong className="text-white font-bold">Sekhar</strong>, a B.Tech Data Science student passionate about{' '}
                    <strong className="text-indigo-400 font-bold">Artificial Intelligence, software development, cybersecurity, and building real-world projects</strong>.
                    I enjoy learning by creating, experimenting with new technologies, and turning ideas into practical solutions.
                  </p>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    I’m currently focused on improving my skills in{' '}
                    <strong className="text-emerald-400 font-bold">Python, C, web development, AI, and data science</strong>, while continuously exploring new areas of technology.
                  </p>
                </div>
              </div>

              {/* 6 3D Skill Bento Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-surface-card/90 rounded-2xl border border-border/80 hover:border-indigo-500/60 transition-all duration-300 space-y-1.5 shadow-xl card-3d-tilt group">
                  <Brain className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">Artificial Intelligence</h4>
                  <p className="text-[11px] text-gray-400">ML & Deep Learning</p>
                </div>

                <div className="p-4 bg-surface-card/90 rounded-2xl border border-border/80 hover:border-emerald-500/60 transition-all duration-300 space-y-1.5 shadow-xl card-3d-tilt group">
                  <Code2 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">Software Dev</h4>
                  <p className="text-[11px] text-gray-400">Python, C & Web</p>
                </div>

                <div className="p-4 bg-surface-card/90 rounded-2xl border border-border/80 hover:border-cyan-500/60 transition-all duration-300 space-y-1.5 shadow-xl card-3d-tilt group">
                  <Shield className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">Cybersecurity</h4>
                  <p className="text-[11px] text-gray-400">Secure Systems</p>
                </div>

                <div className="p-4 bg-surface-card/90 rounded-2xl border border-border/80 hover:border-amber-500/60 transition-all duration-300 space-y-1.5 shadow-xl card-3d-tilt group">
                  <Database className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">Data Science</h4>
                  <p className="text-[11px] text-gray-400">B.Tech Specialization</p>
                </div>

                <div className="p-4 bg-surface-card/90 rounded-2xl border border-border/80 hover:border-purple-500/60 transition-all duration-300 space-y-1.5 shadow-xl card-3d-tilt group">
                  <Globe className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">Web Development</h4>
                  <p className="text-[11px] text-gray-400">Full-Stack Apps</p>
                </div>

                <div className="p-4 bg-surface-card/90 rounded-2xl border border-border/80 hover:border-rose-500/60 transition-all duration-300 space-y-1.5 shadow-xl card-3d-tilt group">
                  <Zap className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xs font-bold text-white">Real-World Projects</h4>
                  <p className="text-[11px] text-gray-400">Practical Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STARTUP VALUE PROPOSITION & REASON FOR BEING                              */}
        {/* ========================================================================= */}
        <section className="w-full max-w-6xl px-4 py-20 border-t border-border/60">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Solving the CS Lab Visibility Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why CodeSphere AI Wins in Educational Technology
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Traditional CS labs force instructors to manually walk between 60+ computer screens or grade static file uploads hours later. CodeSphere AI turns computer labs into live, transparent telemetry streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-surface-card border border-border/80 space-y-4 hover:border-indigo-500/50 transition-all duration-300 shadow-xl card-3d-tilt">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero-Delay Telemetry</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Socket.IO streams keystrokes, compiler execution logs, and live Monaco line cursors under 50ms, allowing TAs to spot stuck students before they give up.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-surface-card border border-border/80 space-y-4 hover:border-emerald-500/50 transition-all duration-300 shadow-xl card-3d-tilt">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero-Spoiler AI Diagnostic Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Integrated AI provides syntax explanations and guided hints without giving away complete code solutions in problem-solving mode, ensuring genuine learning.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-surface-card border border-border/80 space-y-4 hover:border-cyan-500/50 transition-all duration-300 shadow-xl card-3d-tilt">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Proactive Anti-Cheat Guard</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Monaco editor-level event pipelines intercept copy, paste, cut, and tab-blur events, logging non-destructive audit items on the instructor dashboard timeline.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ABOUT CODESPHERE AI PLATFORM ARCHITECTURE SECTION                          */}
        {/* ========================================================================= */}
        <section className="w-full bg-surface-card/40 border-t border-border/60 py-16 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Platform Story */}
            <div className="lg:col-span-7 space-y-6 text-left">
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

            {/* Right Col: 3D Architecture Card */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-surface-card to-background border border-border shadow-2xl relative overflow-hidden space-y-6 text-left card-3d-tilt">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-2xl shadow-inner">
                  <Cpu className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">System Architecture</span>
                  <h3 className="text-2xl font-bold text-white">Production Engine</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Powered by distributed WebSockets, sandboxed compilers, and automated PDF & Excel class reporting.
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
            <div className="p-6 rounded-2xl bg-surface-card border border-border/80 space-y-4 relative text-left card-3d-tilt">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-indigo-600/30">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Create Session</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Teacher fills in subject details, selects Python, C, or Java, and chooses Practice or Problem Solving mode to generate a 6-digit session PIN.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border/80 space-y-4 relative text-left card-3d-tilt">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-emerald-600/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Students Join & Code</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Students enter the 6-digit code with their name and roll number. Monaco Editor streams live code edits, typing indicators, and cursor movements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-surface-card border border-border/80 space-y-4 relative text-left card-3d-tilt">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3 card-3d-tilt">
              <Terminal className="w-6 h-6 text-indigo-400" />
              <h4 className="text-base font-bold text-white">Monaco Editor Engine</h4>
              <p className="text-xs text-gray-400 leading-relaxed">VS Code powered editor with syntax highlighting, indentation, and custom keyboard shortcuts for Python, C, and Java.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3 card-3d-tilt">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Anti-Cheat Activity Tracking</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Detects copy, paste, cut, tab blur, and tab focus events, recording non-destructive activity warnings on the teacher timeline.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3 card-3d-tilt">
              <FileCheck className="w-6 h-6 text-cyan-400" />
              <h4 className="text-base font-bold text-white">Binary PDF & Excel Reports</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Generates comprehensive post-session digital reports containing student execution counts, AI scores, and code snapshots.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3 card-3d-tilt">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white">Context-Aware AI Guidance</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Provides targeted hint generation, syntax error explanations, and code reviews while enforcing problem-mode solution restrictions.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3 card-3d-tilt">
              <Layers className="w-6 h-6 text-rose-400" />
              <h4 className="text-base font-bold text-white">Offline Local Draft Recovery</h4>
              <p className="text-xs text-gray-400 leading-relaxed">Automatically backs up student code to localStorage on every edit, guaranteeing zero data loss during network drops.</p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-card border border-border space-y-3 card-3d-tilt">
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
          <span>by Sekhar for CS Instructors & Students.</span>
        </div>
      </footer>
    </div>
  );
};
