# CodeSphere AI — Intelligent Real-Time Coding Classroom

Production frontend for **CodeSphere AI**, built with React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Zustand, Axios, Socket.IO Client, Monaco Editor, React Hook Form, Zod, and Recharts.

---

## Production Backend Configuration

- **REST Base URL**: `https://codesphere-backend-x1gl.onrender.com/api/v1`
- **Socket.IO Endpoint**: `https://codesphere-backend-x1gl.onrender.com`
- **Socket.IO Path**: `/socket.io/`
- **Transports**: `websocket`, `polling`

---

## Features

### 🎓 Teacher Portal
- **Session Setup**: Form validation for Teacher Name, Email, College, Department, Subject, Title, Language (Python, C, Java), and Mode (Practice, Problem Solving).
- **6-Digit Session Code Display**: Styled 6-digit PIN card generator with one-click copy and dashboard redirect.
- **6-Section Live Classroom Dashboard**:
  1. **Overview**: Session metadata, live timers, student counts, execution metrics, and progress distribution chart.
  2. **Students**: Live roster table displaying online/typing statuses, progress bars, code quality, AI scores, compiler runs, errors, and student inspection drawer.
  3. **Live Activity**: Real-time event log powered by Socket.IO (`student_joined`, `code_updated`, `compiler_completed`, `ai_analysis`, `session_ended`).
  4. **Code & Compiler**: Read-only Monaco Editor displaying active student code & cursor position with compiler execution log.
  5. **AI Insights**: Automated class AI diagnostics, stuck student alerts, top error patterns, and active programming concepts.
  6. **Final Report**: Report status monitoring, End Session confirmation modal, and binary PDF (`/report/pdf`) & Excel (`/report/excel`) report downloads via Axios blobs.

### 💻 Student Workspace
- **6-Digit PIN Join**: 6-digit input UI with auto-focus, paste support, and real-time session status validation.
- **Split Workspace Layout**: Problem statement pane, Monaco Editor with syntax highlighting, and Execution Console terminal (stdout, stderr, stdin, execution time, exit code).
- **Anti-Cheat Activity Tracking**: Detects copy, paste, cut, tab blur, and tab focus, broadcasting warnings to backend activity logs.
- **AI Assistant Drawer**: Interactive AI actions (Get Hint, Explain Error, Review Code) adhering to practice/problem_solving mode rules.
- **Real-Time Synchronization**: Debounced WebSocket emissions (`code_change`, `typing_start`, `typing_stop`, `cursor_change`).

---

## Quick Start & Local Setup

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone or navigate to the project directory
cd codesphere

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Ensure `.env` contains:

```env
VITE_API_BASE_URL=https://codesphere-backend-x1gl.onrender.com/api/v1
VITE_SOCKET_URL=https://codesphere-backend-x1gl.onrender.com
```

### Running Locally

```bash
# Start development server
npm run dev
```

The application will run on `http://localhost:3000`.

### Running Tests & Verification

```bash
# Run Vitest test suite
npm test

# Run TypeScript type check
npm run lint

# Build production bundle
npm run build
```

---

## Project Structure

```
src/
├── app/
│   ├── router.tsx
│   ├── store.ts
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── teacher/
│   │   └── StudentDetailDrawer.tsx
│   ├── student/
│   │   └── PinInput.tsx
│   ├── editor/
│   ├── dashboard/
│   │   ├── OverviewSection.tsx
│   │   ├── StudentsSection.tsx
│   │   ├── LiveActivitySection.tsx
│   │   ├── CodeCompilerSection.tsx
│   │   ├── AIInsightsSection.tsx
│   │   └── FinalReportSection.tsx
│   └── common/
│       ├── Header.tsx
│       └── Modal.tsx
│
├── pages/
│   ├── HomePage.tsx
│   ├── RoleSelectionPage.tsx
│   ├── teacher/
│   │   ├── TeacherSetupPage.tsx
│   │   ├── TeacherSessionCreatedPage.tsx
│   │   ├── TeacherDashboardPage.tsx
│   │   ├── TeacherReportPage.tsx
│   │   └── TeacherEndedPage.tsx
│   └── student/
│       ├── StudentJoinPage.tsx
│       ├── StudentWorkspacePage.tsx
│       └── StudentEndedPage.tsx
│
├── services/
│   ├── api.ts
│   ├── teacherApi.ts
│   ├── studentApi.ts
│   ├── sessionApi.ts
│   ├── compilerApi.ts
│   ├── aiApi.ts
│   ├── reportApi.ts
│   └── socket.ts
│
├── hooks/
│   ├── useSocket.ts
│   ├── useTeacherSession.ts
│   ├── useStudentSession.ts
│   ├── useCodeEditor.ts
│   ├── usePresence.ts
│   ├── useCompiler.ts
│   ├── useAI.ts
│   └── useSessionTimer.ts
│
├── store/
│   ├── sessionStore.ts
│   ├── teacherStore.ts
│   ├── studentStore.ts
│   ├── editorStore.ts
│   └── aiStore.ts
│
├── types/
│   ├── api.ts
│   ├── session.ts
│   ├── student.ts
│   ├── teacher.ts
│   ├── compiler.ts
│   ├── ai.ts
│   ├── report.ts
│   └── websocket.ts
│
├── utils/
│   ├── errors.ts
│   ├── validation.ts
│   ├── storage.ts
│   └── formatting.ts
│
├── styles/
│   └── globals.css
│
├── App.tsx
└── main.tsx
```

---

## License

Production CodeSphere AI Application — Built for live coding classroom instruction.
