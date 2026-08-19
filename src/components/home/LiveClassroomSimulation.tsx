import React, { useState, useEffect } from 'react';
import {
  Code,
  Terminal,
  Activity,
  Zap,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Play,
  Cpu,
  UserCheck,
  Wifi,
  Laptop
} from 'lucide-react';

interface SimulatedStudent {
  id: number;
  name: string;
  roll: string;
  seat: string;
  status: 'typing' | 'running' | 'stuck' | 'online';
  language: string;
  wpm: number;
  progress: number;
  code: string;
  lastOutput: string;
  antiCheatStatus: 'Clean' | 'Paste Blocked' | 'Tab Blur';
}

const INITIAL_DESKS: SimulatedStudent[] = [
  {
    id: 101,
    name: 'Rahul Sharma',
    roll: '21CS042',
    seat: 'A-01',
    status: 'typing',
    language: 'python',
    wpm: 54,
    progress: 85,
    code: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search([2, 5, 8, 12, 16], 12))`,
    lastOutput: 'Output: 3\nExecution Time: 0.02s (Success)',
    antiCheatStatus: 'Clean',
  },
  {
    id: 102,
    name: 'Priya Patel',
    roll: '21CS089',
    seat: 'A-02',
    status: 'running',
    language: 'python',
    wpm: 62,
    progress: 92,
    code: `class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nhead = Node(10)\nhead.next = Node(20)\nprint("Linked List Created:", head.data, "->", head.next.data)`,
    lastOutput: 'Linked List Created: 10 -> 20\nExecution Time: 0.01s (Success)',
    antiCheatStatus: 'Clean',
  },
  {
    id: 103,
    name: 'Sekhar (Lab Lead)',
    roll: '21DS001',
    seat: 'A-03',
    status: 'typing',
    language: 'python',
    wpm: 78,
    progress: 100,
    code: `import numpy as np\nimport pandas as pd\n\n# CodeSphere AI Real-Time Telemetry Pipeline\ndata = np.array([98, 95, 100, 92, 96])\nprint("Classroom Mastery Average:", np.mean(data))`,
    lastOutput: 'Classroom Mastery Average: 96.2\nExecution Time: 0.03s (Success)',
    antiCheatStatus: 'Clean',
  },
  {
    id: 104,
    name: 'Ananya Verma',
    roll: '21CS015',
    seat: 'A-04',
    status: 'stuck',
    language: 'c',
    wpm: 18,
    progress: 40,
    code: `#include <stdio.h>\n\nint main() {\n    int *ptr = NULL;\n    *ptr = 42; // Segmentation Fault (Null Dereference)\n    return 0;\n}`,
    lastOutput: 'SIGSEGV (Segmentation Fault)\nAI Diagnostic: Null pointer dereference detected.',
    antiCheatStatus: 'Tab Blur',
  },
  {
    id: 105,
    name: 'Vikram Reddy',
    roll: '21CS112',
    seat: 'B-01',
    status: 'online',
    language: 'java',
    wpm: 45,
    progress: 70,
    code: `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("CodeSphere AI Real-Time Java Engine");\n    }\n}`,
    lastOutput: 'CodeSphere AI Real-Time Java Engine',
    antiCheatStatus: 'Clean',
  },
  {
    id: 106,
    name: 'Sneha Rao',
    roll: '21CS098',
    seat: 'B-02',
    status: 'typing',
    language: 'python',
    wpm: 50,
    progress: 60,
    code: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint([fibonacci(i) for i in range(8)])`,
    lastOutput: '[0, 1, 1, 2, 3, 5, 8, 13]',
    antiCheatStatus: 'Paste Blocked',
  },
  {
    id: 107,
    name: 'Arjun Das',
    roll: '21CS028',
    seat: 'B-03',
    status: 'typing',
    language: 'c',
    wpm: 40,
    progress: 75,
    code: `#include <stdio.h>\n\nvoid reverse(char *str) {\n    // C String Reversal Logic\n}\n\nint main() {\n    printf("Reversing string...\\n");\n    return 0;\n}`,
    lastOutput: 'Reversing string...',
    antiCheatStatus: 'Clean',
  },
  {
    id: 108,
    name: 'Kavya Nair',
    roll: '21CS063',
    seat: 'B-04',
    status: 'stuck',
    language: 'python',
    wpm: 12,
    progress: 35,
    code: `def merge_sort(arr):\n    # Recursive Split Logic Missing Exit Condition\n    mid = len(arr) // 2\n    return merge_sort(arr[:mid]) + merge_sort(arr[mid:])`,
    lastOutput: 'RecursionError: maximum recursion depth exceeded',
    antiCheatStatus: 'Clean',
  },
];

export const LiveClassroomSimulation: React.FC = () => {
  const [students, setStudents] = useState<SimulatedStudent[]>(INITIAL_DESKS);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(103); // Default to Sekhar
  const [eventLog, setEventLog] = useState<string[]>([]);

  // Simulated Real-Time Socket.IO Telemetry Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * students.length);
      const student = students[randomIdx];

      const events = [
        `[Socket.IO] code_change from ${student.name} (Desk ${student.seat})`,
        `[Compiler] Executed ${student.language.toUpperCase()} script cleanly (0.02s)`,
        `[Anti-Cheat Guard] Intercepted paste attempt on ${student.name}'s editor`,
        `[AI Diagnostic] Identified recursion base case error for ${student.name}`,
        `[Presence] Heartbeat sync from ${student.name} (Latency: 24ms)`,
      ];

      const newMsg = events[Math.floor(Math.random() * events.length)];
      const timestamp = new Date().toLocaleTimeString();

      setEventLog((prev) => [`${timestamp} - ${newMsg}`, ...prev.slice(0, 15)]);

      // Dynamically tweak simulated WPM and progress slightly
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === student.id) {
            const nextProgress = Math.min(100, s.progress + Math.floor(Math.random() * 3));
            return {
              ...s,
              wpm: Math.floor(40 + Math.random() * 35),
              progress: nextProgress,
            };
          }
          return s;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [students]);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="w-full bg-surface-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden text-left">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            <span>100% Live Interactive Classroom Matrix</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Simulated Student Desks & Real-Time Telemetry
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">
            Click on any student desk in the matrix to inspect live code, anti-cheat detection, and AI progress in real time.
          </p>
        </div>

        {/* Live Lab Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-background/80 p-3 rounded-2xl border border-border/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-gray-300">Typing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-spin" />
            <span className="text-gray-300">Running</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-gray-300">Stuck (AI Alert)</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Interactive Desks Matrix & Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Interactive Desks Grid ("Movie Ticket / Seat Matrix" style) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            Classroom Desks Seating Matrix (Click to Inspect)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {students.map((st) => {
              const isSelected = st.id === activeStudent.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`relative p-4 rounded-2xl border transition-all duration-300 text-left space-y-2 group ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/40 scale-[1.02]'
                      : 'bg-surface/80 border-border/80 hover:border-gray-600 hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-gray-400 group-hover:text-white">
                      Desk {st.seat}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        st.status === 'typing'
                          ? 'bg-cyan-400 animate-pulse'
                          : st.status === 'running'
                          ? 'bg-emerald-400'
                          : st.status === 'stuck'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{st.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono block">{st.roll}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-border/40">
                    <span>{st.wpm} WPM</span>
                    <span className="text-emerald-400 font-bold">{st.progress}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Real-Time Socket.IO Telemetry Ticker Log */}
          <div className="p-4 bg-background rounded-2xl border border-border/80 font-mono text-xs text-gray-300 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 text-gray-400">
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Socket.IO Live Broadcast Telemetry Stream</span>
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                Sub-50ms Stream
              </span>
            </div>

            <div className="h-28 overflow-y-auto space-y-1 text-[11px] text-emerald-400">
              {eventLog.length === 0 ? (
                <span className="text-gray-500 animate-pulse">// Waiting for live classroom telemetry...</span>
              ) : (
                eventLog.map((log, i) => (
                  <div key={i} className="truncate">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Selected Student Live Inspection Pane */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">
                Live Inspection: {activeStudent.name}
              </h4>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {activeStudent.seat}
            </span>
          </div>

          {/* Student Status Quick Cards */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-background rounded-xl border border-border/60">
              <span className="text-gray-400 block text-[10px]">Anti-Cheat Guard:</span>
              <span className={`font-bold font-mono text-[11px] ${
                activeStudent.antiCheatStatus === 'Clean' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {activeStudent.antiCheatStatus}
              </span>
            </div>

            <div className="p-2.5 bg-background rounded-xl border border-border/60">
              <span className="text-gray-400 block text-[10px]">AI Diagnostic Status:</span>
              <span className={`font-bold font-mono text-[11px] ${
                activeStudent.status === 'stuck' ? 'text-amber-400' : 'text-cyan-400'
              }`}>
                {activeStudent.status === 'stuck' ? 'STUCK (Help Sent)' : 'ON TRACK'}
              </span>
            </div>
          </div>

          {/* Live Monaco Code Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1 font-semibold text-gray-300">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Monaco Code View</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-400 capitalize">
                {activeStudent.language}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-border/80 font-mono text-[11px] text-indigo-200 h-44 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{activeStudent.code}</pre>
            </div>
          </div>

          {/* Compiler Terminal Output */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold text-gray-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compiler Console Output</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-border/80 font-mono text-[11px] text-emerald-400 h-20 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{activeStudent.lastOutput}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
