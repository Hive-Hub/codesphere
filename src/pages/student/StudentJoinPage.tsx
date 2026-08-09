import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentJoinSchema } from '../../utils/validation';
import { StudentJoinPayload } from '../../types/student';
import { studentApi } from '../../services/studentApi';
import { sessionApi } from '../../services/sessionApi';
import { storage } from '../../utils/storage';
import { useStudentStore } from '../../store/studentStore';
import { useSessionStore } from '../../store/sessionStore';
import { parseApiError } from '../../utils/errors';
import { Header } from '../../components/common/Header';
import { PinInput } from '../../components/student/PinInput';
import { Users, ArrowRight, User, Hash, Building, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const StudentJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionCode, setSessionCode] = useState<string>('');
  const [isValidatingCode, setIsValidatingCode] = useState<boolean>(false);
  const [sessionDetails, setSessionDetails] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { setStudentData } = useStudentStore();
  const { setSession, setActiveRole } = useSessionStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentJoinPayload>({
    resolver: zodResolver(studentJoinSchema),
    defaultValues: {
      session_code: '',
      name: '',
      roll_number: '',
      department: 'Computer Science',
      year: '3rd Year',
      section: 'A',
    },
  });

  const handleCodeComplete = async (code: string) => {
    setValue('session_code', code);
    setSessionCode(code);
    try {
      setIsValidatingCode(true);
      setError(null);
      const res = await sessionApi.checkStatus(code);
      if (res.success && res.data) {
        if (!res.data.is_active || res.data.status !== 'active') {
          setError('This session is currently inactive or has ended.');
          setSessionDetails(null);
        } else {
          setSessionDetails(res.data);
        }
      }
    } catch (err: any) {
      setError(parseApiError(err));
      setSessionDetails(null);
    } finally {
      setIsValidatingCode(false);
    }
  };

  const onSubmit = async (data: StudentJoinPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await studentApi.joinSession(data);
      if (res.success && res.data) {
        const { student_token, student, session } = res.data;

        // Store student token and IDs
        storage.setActiveRole('student');
        storage.setStudentToken(student_token);
        const sId = (session as any).session_id || session.id;
        storage.setSessionId(sId);
        storage.setStudentId(student.id);
        storage.setSessionInfo({ student, session, student_token });

        setActiveRole('student');
        setStudentData(student, student_token);

        navigate(`/student/session/${sId}`);
      } else {
        setError(res.message || 'Failed to join session');
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

      <main className="flex-1 max-w-xl mx-auto px-4 py-8 sm:py-12 w-full flex flex-col items-center justify-center">
        <div className="bg-surface-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 w-full">
          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Join Coding Classroom</h1>
              <p className="text-xs sm:text-sm text-gray-400">Enter your 6-digit session code and student details</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: 6-Digit Session Code Input */}
            <div className="space-y-3 text-center">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                Enter 6-Digit Session Code
              </label>
              <PinInput
                value={sessionCode}
                onChange={(val) => {
                  setSessionCode(val);
                  setValue('session_code', val);
                }}
                onComplete={handleCodeComplete}
                disabled={isSubmitting}
              />
              {errors.session_code && (
                <p className="text-xs text-rose-400">{errors.session_code.message}</p>
              )}
            </div>

            {/* Validated Session Info Card */}
            {sessionDetails && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 animate-fade-in text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Session Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
                  <div>
                    <span className="text-gray-400 block">Class Title:</span>
                    <strong className="text-white">{sessionDetails.title}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Teacher:</span>
                    <strong className="text-white">{sessionDetails.teacher_name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Language:</span>
                    <strong className="text-emerald-400 capitalize">{sessionDetails.language}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Mode:</span>
                    <strong className="text-indigo-400 capitalize">{sessionDetails.mode?.replace('_', ' ')}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Student Details Form */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Student Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Rahul Sharma"
                    {...register('name')}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
                </div>

                {/* Roll Number */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-emerald-400" />
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    placeholder="22CS041"
                    {...register('roll_number')}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.roll_number && <p className="text-xs text-rose-400">{errors.roll_number.message}</p>}
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                    <Building className="w-3 h-3 text-emerald-400" />
                    Department *
                  </label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    {...register('department')}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  {errors.department && <p className="text-xs text-rose-400">{errors.department.message}</p>}
                </div>

                {/* Year & Section */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Year *</label>
                    <input
                      type="text"
                      placeholder="3rd Year"
                      {...register('year')}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-300">Section *</label>
                    <input
                      type="text"
                      placeholder="A"
                      {...register('section')}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Join Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || sessionCode.length !== 6}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-base transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Joining Session...' : 'Enter Student Workspace'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
