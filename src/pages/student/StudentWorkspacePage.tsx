import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentSession } from '../../hooks/useStudentSession';
import { useCodeEditor } from '../../hooks/useCodeEditor';
import { useCompiler } from '../../hooks/useCompiler';
import { useAI } from '../../hooks/useAI';
import { useSocket } from '../../hooks/useSocket';
import { usePresence } from '../../hooks/usePresence';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useSessionStore } from '../../store/sessionStore';
import { useStudentStore } from '../../store/studentStore';
import { useEditorStore } from '../../store/editorStore';
import { useAIStore } from '../../store/aiStore';
import { Header } from '../../components/common/Header';
import { DebugPanel } from '../../components/common/DebugPanel';
import { Modal } from '../../components/common/Modal';
import { storage } from '../../utils/storage';
import { socketService } from '../../services/socket';
import Editor from '@monaco-editor/react';
import {
  Play,
  Save,
  Sparkles,
  HelpCircle,
  Code,
  Terminal,
  AlertTriangle,
  BookOpen,
  Lock,
  X,
  MessageSquare,
  WifiOff,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Wifi,
  RotateCcw,
  FileCode,
} from 'lucide-react';

export const StudentWorkspacePage: React.FC = () => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const sessionId = parseInt(paramSessionId || '1', 10);
  const navigate = useNavigate();

  const { session, problem, sessionEnded, endedReason, workspaceStatus } = useSessionStore();
  const { student, studentId, warningMessage, setWarningMessage, draftAvailable, draftCode, setDraftAvailable } = useStudentStore();
  const { loading, error: sessionError, refetchSessionDetails } = useStudentSession(sessionId);
  const { isConnected, connectionState, isOnline, statusLabel } = usePresence();
  const { isOnline: networkOnline, showRestoredBanner } = useNetworkStatus();

  const { code, language, handleCodeChange, handleCursorChange, saveCode } = useCodeEditor(sessionId);
  const { runCode, error: compilerError, timeoutWarning } = useCompiler(sessionId);
  const { explainError, getHint, reviewCode, error: aiError } = useAI(sessionId);

  const {
    stdin,
    setStdin,
    isSaving,
    lastSavedAt,
    isRunning,
    compilerResult,
    compilerState,
    activeConsoleTab,
    setActiveConsoleTab,
    setCode,
  } = useEditorStore();

  const { aiResponse, isLoadingAI, aiMode, clearAI } = useAIStore();

  const [showAiDrawer, setShowAiDrawer] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lastActivityTimeRef = useRef<Record<string, number>>({});

  // Initialize socket listener for student role
  useSocket(sessionId, 'student');

  // Stop all socket activity when session ends
  useEffect(() => {
    if (sessionEnded) {
      socketService.stopSessionActivity();
    }
  }, [sessionEnded]);

  // Cooldown-guarded toast warning
  const triggerActivityWarning = useCallback((eventType: string, userMsg: string) => {
    const now = Date.now();
    const lastTime = lastActivityTimeRef.current[eventType] || 0;

    if (now - lastTime > 2000) {
      lastActivityTimeRef.current[eventType] = now;
      setToastMessage(userMsg);
      setTimeout(() => setToastMessage(null), 3500);

      const sid = student?.id || studentId;
      if (sid && sessionId) {
        socketService.emitActivity(sessionId, sid, eventType, { timestamp: new Date().toISOString() });
      }
    }
  }, [sessionId, student?.id, studentId]);

  // Tab visibility change tracking
  useEffect(() => {
    if (sessionEnded) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerActivityWarning('tab_blur', 'Tab switched. Activity recorded.');
      } else {
        triggerActivityWarning('tab_focus', 'Returned to workspace.');
      }
    };

    const handleWindowBlur = () => {
      triggerActivityWarning('tab_blur', 'Window focus lost. Activity recorded.');
    };

    const handleWindowFocus = () => {
      triggerActivityWarning('tab_focus', 'Workspace focused.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [triggerActivityWarning, sessionEnded]);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    if (draftCode) {
      setCode(draftCode);
      setDraftAvailable(false, null);
    }
  };

  const handleUseSeverVersion = () => {
    setDraftAvailable(false, null);
  };

  const handleRun = async () => {
    if (sessionEnded) return;
    await runCode();
  };

  const handleSave = async () => {
    if (sessionEnded) return;
    await saveCode();
  };

  const handleExplainError = async () => {
    setShowAiDrawer(true);
    await explainError();
  };

  const handleGetHint = async () => {
    setShowAiDrawer(true);
    await getHint(problem?.description);
  };

  const handleReviewCode = async () => {
    setShowAiDrawer(true);
    await reviewCode();
  };

  const currentProgress = student?.progress ?? 0;

  // ─── Loading State: Don't show editor until workspace is READY ───
  if (loading || workspaceStatus === 'CONNECTING' || workspaceStatus === 'JOINING' || workspaceStatus === 'LOADING') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-indigo-400 animate-spin" />
            <div>
              <p className="text-lg font-semibold text-white">
                {workspaceStatus === 'CONNECTING' && 'Connecting to CodeSphere...'}
                {workspaceStatus === 'JOINING' && 'Joining session...'}
                {(workspaceStatus === 'LOADING' || loading) && 'Loading workspace...'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Please wait while we set up your coding environment.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Error State: Backend unavailable or session load failed ───
  if (workspaceStatus === 'ERROR' || sessionError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="w-12 h-12 mx-auto text-rose-400" />
            <div>
              <p className="text-lg font-semibold text-white">Unable to load workspace</p>
              <p className="text-xs text-gray-400 mt-1">
                {sessionError || 'CodeSphere server is temporarily unavailable. Please try again.'}
              </p>
            </div>
            <button
              onClick={() => refetchSessionDetails()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Header />

      {/* Network Offline Banner */}
      {!isOnline && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-2 text-center text-xs font-semibold text-rose-300 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Internet connection lost. Your code is safely saved locally.</span>
        </div>
      )}

      {/* Connection Lost Banner (socket disconnected but network online) */}
      {isOnline && !isConnected && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-semibold text-amber-300 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            {connectionState === 'RECONNECTING'
              ? 'Reconnecting to classroom... Your code is safely saved locally.'
              : 'Connection lost. Attempting to reconnect...'}
          </span>
        </div>
      )}

      {/* Network Restored Banner */}
      {showRestoredBanner && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-center text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>Internet connection restored.</span>
        </div>
      )}

      {/* Anti-Cheat Activity Toast Banner */}
      {toastMessage && (
        <div className="bg-amber-500/90 text-slate-950 font-bold px-4 py-2 text-center text-xs flex items-center justify-center gap-2 shadow-lg animate-bounce sticky top-[65px] z-50">
          <ShieldAlert className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Draft Restoration Banner */}
      {draftAvailable && draftCode && (
        <div className="bg-indigo-500/15 border-b border-indigo-500/30 px-4 py-3 text-center text-xs font-semibold text-indigo-300 flex items-center justify-center gap-3">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span>Local draft found from a previous session.</span>
          <button
            onClick={handleRestoreDraft}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Restore Draft
          </button>
          <button
            onClick={handleUseSeverVersion}
            className="px-3 py-1 bg-surface hover:bg-surface-hover border border-border text-gray-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Use Server Version
          </button>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 max-w-[1800px] mx-auto w-full">
        {/* Left Column: Problem Statement / Instruction Pane */}
        <div className="w-full lg:w-1/3 bg-surface-card border border-border rounded-2xl p-6 flex flex-col justify-between overflow-y-auto max-h-[450px] lg:max-h-none shadow-xl text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>{session?.mode === 'problem_solving' ? 'Problem Statement' : 'Practice Workspace'}</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono capitalize">
                {session?.language || 'python'}
              </span>
            </div>

            {/* Problem Solving Mode Progress */}
            {session?.mode === 'problem_solving' && (
              <div className="p-3 bg-surface rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300">Backend AI Progress</span>
                  <span className="font-mono font-bold text-indigo-400">{currentProgress}%</span>
                </div>
                <div className="w-full bg-background h-2 rounded-full overflow-hidden border border-border">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>
            )}

            {session?.mode === 'problem_solving' && problem ? (
              <div className="space-y-4 text-xs text-gray-300">
                <h2 className="text-lg font-bold text-white">{problem.title}</h2>
                <p className="whitespace-pre-wrap leading-relaxed">{problem.description}</p>

                {problem.constraints && (
                  <div className="p-3 bg-surface rounded-xl border border-border">
                    <span className="font-semibold text-gray-200 block mb-1">Constraints:</span>
                    <p className="font-mono text-gray-400">{problem.constraints}</p>
                  </div>
                )}

                {problem.sample_input && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <span className="font-semibold text-gray-200 block mb-1">Sample Input:</span>
                      <pre className="font-mono text-gray-400 whitespace-pre-wrap">{problem.sample_input}</pre>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <span className="font-semibold text-gray-200 block mb-1">Sample Output:</span>
                      <pre className="font-mono text-emerald-400 whitespace-pre-wrap">{problem.sample_output}</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-xs text-gray-300">
                <h2 className="text-lg font-bold text-white">{session?.title || 'Interactive Practice Session'}</h2>
                <p className="leading-relaxed">
                  Write and execute {session?.language?.toUpperCase()} code. Your typing status, code edits, and compiler executions are synced live with your teacher.
                </p>
                <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
                  <span className="font-semibold text-indigo-400 block">Class Details:</span>
                  <p>Subject: {session?.subject}</p>
                  <p>Department: {session?.department}</p>
                  <p>Institution: {session?.college}</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Helper Buttons */}
          <div className="pt-6 border-t border-border space-y-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              AI Classroom Assistant
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleGetHint}
                disabled={sessionEnded || isLoadingAI}
                className="py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Hint</span>
              </button>

              <button
                onClick={handleExplainError}
                disabled={sessionEnded || isLoadingAI}
                className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Explain Error</span>
              </button>

              <button
                onClick={handleReviewCode}
                disabled={sessionEnded || isLoadingAI}
                className="py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Monaco Editor & Console Terminal */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {/* Monaco Editor Container with Copy/Paste Interception */}
          <div
            className="bg-surface-card border border-border rounded-2xl overflow-hidden flex flex-col h-[480px] shadow-xl"
            onPaste={(e) => {
              if (!sessionEnded) {
                e.preventDefault();
                triggerActivityWarning('paste_attempt', 'Paste is disabled during this coding session.');
              }
            }}
            onCopy={(e) => {
              if (!sessionEnded) {
                e.preventDefault();
                triggerActivityWarning('copy_attempt', 'Copying is disabled during this coding session.');
              }
            }}
            onCut={(e) => {
              if (!sessionEnded) {
                e.preventDefault();
                triggerActivityWarning('cut_attempt', 'Cutting is disabled during this coding session.');
              }
            }}
          >
            <div className="bg-surface px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-gray-200">Monaco Editor ({language.toUpperCase()})</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                {isSaving ? (
                  <span className="text-amber-400 animate-pulse font-semibold">SAVING...</span>
                ) : lastSavedAt ? (
                  <span className="text-gray-400">
                    SAVED: <strong className="text-emerald-400">{lastSavedAt}</strong>
                  </span>
                ) : null}
                <span className="px-2 py-0.5 rounded bg-surface-hover text-indigo-300 font-mono text-[11px]">
                  UTF-8
                </span>
              </div>
            </div>

            <div className="flex-1 bg-background">
              <Editor
                height="100%"
                language={language.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(val) => handleCodeChange(val || '')}
                onMount={(editor) => {
                  // Cursor position tracking
                  editor.onDidChangeCursorPosition((e) => {
                    handleCursorChange(e.position.lineNumber, e.position.column);
                  });

                  // Intercept Keyboard Copy/Paste/Cut directly in Monaco
                  editor.onKeyDown((e) => {
                    if (sessionEnded) return;

                    // Ctrl+V / Cmd+V / Shift+Insert (Paste)
                    if (
                      (e.ctrlKey || e.metaKey) && e.keyCode === 52 ||
                      (e.shiftKey && e.keyCode === 45)
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerActivityWarning('paste_attempt', 'Paste is disabled during this coding session.');
                    }

                    // Ctrl+C / Cmd+C (Copy)
                    if ((e.ctrlKey || e.metaKey) && e.keyCode === 33) {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerActivityWarning('copy_attempt', 'Copying is disabled during this coding session.');
                    }

                    // Ctrl+X / Cmd+X (Cut)
                    if ((e.ctrlKey || e.metaKey) && e.keyCode === 54) {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerActivityWarning('cut_attempt', 'Cutting is disabled during this coding session.');
                    }
                  });
                }}
                options={{
                  readOnly: sessionEnded,
                  contextmenu: false,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: 'Fira Code',
                  tabSize: 4,
                }}
              />
            </div>
          </div>

          {/* Action Bar (Run & Save) */}
          <div className="flex items-center justify-between bg-surface-card p-3 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning || sessionEnded}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>{isRunning ? 'RUNNING...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || sessionEnded}
                className="py-2.5 px-5 bg-surface hover:bg-surface-hover border border-border text-gray-200 font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-indigo-400" />
                <span>{isSaving ? 'SAVING...' : 'Save Draft'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Timeout Warning */}
              {timeoutWarning && (
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Execution taking longer than expected
                </span>
              )}

              {/* Compiler State Badge */}
              {compilerState !== 'idle' && compilerState !== 'running' && (
                <span className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                  compilerState === 'success'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : compilerState === 'unavailable'
                    ? 'text-gray-400 bg-gray-500/10 border-gray-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {compilerState === 'success' ? '✓ SUCCESS' :
                   compilerState === 'compilation_error' ? '✗ COMPILATION ERROR' :
                   compilerState === 'runtime_error' ? '✗ RUNTIME ERROR' :
                   compilerState === 'timeout' ? '⏱ TIMEOUT' :
                   compilerState === 'unavailable' ? '⚠ COMPILER UNAVAILABLE' :
                   compilerState === 'network_error' ? '⚠ NETWORK ERROR' : ''}
                </span>
              )}

              {sessionEnded && (
                <span className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
                  <Lock className="w-3.5 h-3.5" />
                  SESSION ENDED
                </span>
              )}
            </div>
          </div>

          {/* Console Terminal Container */}
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden flex flex-col h-[280px]">
            {/* Terminal Header Tabs */}
            <div className="bg-surface px-4 py-2 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveConsoleTab('output')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeConsoleTab === 'output'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Output (stdout)
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('input')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeConsoleTab === 'input'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Custom Standard Input (stdin)
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('errors')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeConsoleTab === 'errors'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Errors (stderr)
                  </button>
                </div>
              </div>

              {compilerResult && (
                <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                  <span>
                    Status: <strong className={compilerResult.exit_code === 0 ? 'text-emerald-400' : 'text-rose-400'}>{(compilerResult.status || 'FINISHED').toUpperCase()}</strong>
                  </span>
                  {compilerResult.execution_time && (
                    <span>Time: <strong className="text-indigo-400">{compilerResult.execution_time}</strong></span>
                  )}
                  {compilerResult.memory && (
                    <span>Memory: <strong className="text-cyan-400">{compilerResult.memory}</strong></span>
                  )}
                </div>
              )}
            </div>

            {/* Terminal Tab Body */}
            <div className="flex-1 bg-background p-4 font-mono text-xs overflow-y-auto text-left">
              {activeConsoleTab === 'output' && (
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {compilerResult?.stdout || compilerResult?.output || '// Run code to view stdout output here.'}
                </pre>
              )}

              {activeConsoleTab === 'input' && (
                <div className="space-y-2">
                  <span className="text-gray-500 block">// Pass custom input lines to your program's stdin:</span>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input parameters here..."
                    className="w-full h-36 bg-surface border border-border rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {activeConsoleTab === 'errors' && (
                <pre className="text-rose-400 whitespace-pre-wrap">
                  {compilerResult?.stderr || compilerResult?.error || compilerError || '// No compiler or runtime errors detected.'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant Drawer */}
      {showAiDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in text-left">
          <div className="w-full max-w-lg bg-surface border-l border-border h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="bg-surface/95 backdrop-blur-md px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <span className="capitalize">AI Assistant ({aiMode})</span>
              </div>
              <button
                onClick={() => {
                  setShowAiDrawer(false);
                  clearAI();
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {isLoadingAI ? (
                <div className="text-center py-20 space-y-3">
                  <Sparkles className="w-8 h-8 mx-auto text-indigo-400 animate-spin" />
                  <p className="text-sm font-semibold text-gray-300">AI ANALYZING CODE...</p>
                  <p className="text-xs text-gray-500">Evaluating syntax, logic, and potential runtime issues.</p>
                </div>
              ) : aiError ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {aiError}
                </div>
              ) : aiResponse ? (
                <div className="space-y-4 text-xs text-gray-300">
                  <div className="p-4 bg-surface-card rounded-xl border border-border">
                    <span className="font-semibold text-indigo-400 block mb-1">Summary:</span>
                    <p className="leading-relaxed text-white">{aiResponse.summary}</p>
                  </div>

                  {aiResponse.explanation && (
                    <div className="p-4 bg-surface-card rounded-xl border border-border">
                      <span className="font-semibold text-amber-400 block mb-1">Detailed Explanation:</span>
                      <p className="leading-relaxed">{aiResponse.explanation}</p>
                    </div>
                  )}

                  {aiResponse.hint && (
                    <div className="p-4 bg-surface-card rounded-xl border border-border">
                      <span className="font-semibold text-emerald-400 block mb-1">Guided Hint:</span>
                      <p className="leading-relaxed">{aiResponse.hint}</p>
                    </div>
                  )}

                  {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
                    <div className="p-4 bg-surface-card rounded-xl border border-border space-y-1">
                      <span className="font-semibold text-cyan-400 block mb-1">Next Steps & Suggestions:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {aiResponse.suggestions.map((sug, idx) => (
                          <li key={idx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Session Ended Modal */}
      <Modal
        isOpen={sessionEnded}
        onClose={() => navigate('/student/ended')}
        title="SESSION ENDED"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your coding session has concluded.</h3>
            <p className="text-xs text-gray-400 mt-1">Reason: {endedReason || 'Teacher ended session'}</p>
          </div>
          <button
            onClick={() => navigate('/student/ended')}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Acknowledge & Exit Workspace
          </button>
        </div>
      </Modal>

      {/* Debug Panel (dev only) */}
      <DebugPanel />
    </div>
  );
};
