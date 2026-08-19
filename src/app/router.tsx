import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { RoleSelectionPage } from '../pages/RoleSelectionPage';
import { TeacherHomePage } from '../pages/teacher/TeacherHomePage';
import { TeacherSessionsPage } from '../pages/teacher/TeacherSessionsPage';
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage';
import { TeacherSetupPage } from '../pages/teacher/TeacherSetupPage';
import { TeacherSessionCreatedPage } from '../pages/teacher/TeacherSessionCreatedPage';
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { TeacherReportPage } from '../pages/teacher/TeacherReportPage';
import { TeacherEndedPage } from '../pages/teacher/TeacherEndedPage';
import { StudentJoinPage } from '../pages/student/StudentJoinPage';
import { StudentWorkspacePage } from '../pages/student/StudentWorkspacePage';
import { StudentEndedPage } from '../pages/student/StudentEndedPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/role-selection',
    element: <RoleSelectionPage />,
  },

  // Teacher Routes
  {
    path: '/teacher/home',
    element: <TeacherHomePage />,
  },
  {
    path: '/teacher/sessions',
    element: <TeacherSessionsPage />,
  },
  {
    path: '/teacher/students',
    element: <TeacherStudentsPage />,
  },
  {
    path: '/teacher/reports',
    element: <TeacherReportPage />,
  },
  {
    path: '/teacher',
    element: <TeacherSetupPage />,
  },
  {
    path: '/teacher/session/created',
    element: <TeacherSessionCreatedPage />,
  },
  {
    path: '/teacher/dashboard/:sessionId',
    element: <TeacherDashboardPage />,
  },
  {
    path: '/teacher/session/:sessionId/dashboard',
    element: <TeacherDashboardPage />,
  },
  {
    path: '/teacher/session/:sessionId/report',
    element: <TeacherReportPage />,
  },
  {
    path: '/teacher/ended',
    element: <TeacherEndedPage />,
  },

  // Student Routes
  {
    path: '/student',
    element: <StudentJoinPage />,
  },
  {
    path: '/student/session/:sessionId',
    element: <StudentWorkspacePage />,
  },
  {
    path: '/student/ended',
    element: <StudentEndedPage />,
  },

  // Catch-all Wildcard Route for Reload / Unknown URLs
  {
    path: '*',
    element: <HomePage />,
  },
]);
