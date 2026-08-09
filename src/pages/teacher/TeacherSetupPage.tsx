import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teacherSetupSchema } from '../../utils/validation';
import { TeacherSessionCreatePayload } from '../../types/teacher';
import { teacherApi } from '../../services/teacherApi';
import { apiClient } from '../../services/api';
import { storage } from '../../utils/storage';
import { useSessionStore } from '../../store/sessionStore';
import { parseApiError } from '../../utils/errors';
import { Header } from '../../components/common/Header';
import { GraduationCap, ArrowRight, BookOpen, Layers, User, Mail, School, Building, Loader2 } from 'lucide-react';

export const TeacherSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setSession, setActiveRole } = useSessionStore();

  // Pre-warm Render backend on page load to eliminate cold start delay
  useEffect(() => {
    apiClient.get('/health').catch(() => {});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSessionCreatePayload>({
    resolver: zodResolver(teacherSetupSchema),
    defaultValues: {
      teacher_name: '',
      teacher_email: '',
      college: '',
      department: 'Computer Science',
      subject: 'Data Structures & Algorithms',
      title: 'Python Lab Session 1',
      language: 'python',
      mode: 'practice',
    },
  });

  const onSubmit = async (data: TeacherSessionCreatePayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await teacherApi.createSession(data);
      if (res.success && res.data) {
        const { teacher_token, session } = res.data;
        
        // Store session tokens cleanly
        storage.setActiveRole('teacher');
        storage.setTeacherToken(teacher_token);
        storage.setSessionId(session.id);
        storage.setSessionInfo({ session, teacher_token });
        
        setActiveRole('teacher');
        setSession(session);

        navigate('/teacher/session/created');
      } else {
        setError(res.message || 'Failed to create session');
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
        <div className="bg-surface-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create Coding Session</h1>
              <p className="text-xs sm:text-sm text-gray-400">Configure language, mode, and details for your live classroom</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Teacher Name *
                </label>
                <input
                  type="text"
                  placeholder="Dr. Jane Smith"
                  {...register('teacher_name')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.teacher_name && (
                  <p className="text-xs text-rose-400">{errors.teacher_name.message}</p>
                )}
              </div>

              {/* Teacher Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Teacher Email *
                </label>
                <input
                  type="email"
                  placeholder="jsmith@university.edu"
                  {...register('teacher_email')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.teacher_email && (
                  <p className="text-xs text-rose-400">{errors.teacher_email.message}</p>
                )}
              </div>

              {/* College */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-indigo-400" />
                  College / Institution *
                </label>
                <input
                  type="text"
                  placeholder="Engineering College"
                  {...register('college')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.college && (
                  <p className="text-xs text-rose-400">{errors.college.message}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  Department *
                </label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  {...register('department')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.department && (
                  <p className="text-xs text-rose-400">{errors.department.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Subject / Course Name *</label>
                <input
                  type="text"
                  placeholder="Data Structures"
                  {...register('subject')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.subject && (
                  <p className="text-xs text-rose-400">{errors.subject.message}</p>
                )}
              </div>

              {/* Session Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Session Title *</label>
                <input
                  type="text"
                  placeholder="Lab Session 1 - Arrays"
                  {...register('title')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.title && (
                  <p className="text-xs text-rose-400">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Teaching Language & Mode Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              {/* Language */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Teaching Language *
                </label>
                <select
                  {...register('language')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium capitalize"
                >
                  <option value="python">Python</option>
                  <option value="c">C Programming</option>
                  <option value="java">Java</option>
                </select>
                {errors.language && (
                  <p className="text-xs text-rose-400">{errors.language.message}</p>
                )}
              </div>

              {/* Mode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Session Mode *
                </label>
                <select
                  {...register('mode')}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium capitalize"
                >
                  <option value="practice">Practice Mode</option>
                  <option value="problem_solving">Problem Solving Mode</option>
                </select>
                {errors.mode && (
                  <p className="text-xs text-rose-400">{errors.mode.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Session...' : 'Generate Session Code & Continue'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
