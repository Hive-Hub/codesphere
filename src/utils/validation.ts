import { z } from 'zod';

export const teacherSetupSchema = z.object({
  teacher_name: z.string().min(1, 'Teacher name is required').max(100),
  teacher_email: z.string().email('Please enter a valid email address'),
  college: z.string().min(1, 'College name is required').max(150),
  department: z.string().min(1, 'Department is required').max(100),
  subject: z.string().min(1, 'Subject is required').max(100),
  title: z.string().min(1, 'Session title is required').max(200),
  language: z.enum(['python', 'c', 'java'], {
    errorMap: () => ({ message: 'Language must be Python, C, or Java' }),
  }),
  mode: z.enum(['practice', 'problem_solving'], {
    errorMap: () => ({ message: 'Mode must be Practice or Problem Solving' }),
  }),
});

export const studentJoinSchema = z.object({
  session_code: z
    .string()
    .length(6, 'Session code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Session code must contain numbers only'),
  name: z.string().min(1, 'Student name is required').max(100),
  roll_number: z.string().min(1, 'Roll Number is required').max(50),
  department: z.string().min(1, 'Department is required').max(100),
  year: z.string().min(1, 'Year is required').max(20),
  section: z.string().min(1, 'Section is required').max(20),
});

export const problemCreateSchema = z.object({
  title: z.string().min(1, 'Problem title is required').max(200),
  description: z.string().min(1, 'Problem description is required'),
  constraints: z.string().optional(),
  input_format: z.string().optional(),
  output_format: z.string().optional(),
  sample_input: z.string().optional(),
  sample_output: z.string().optional(),
  reference_solution: z.string().optional(),
});

export const sessionCodeSchema = z
  .string()
  .length(6, 'Must be 6 digits')
  .regex(/^\d{6}$/, 'Digits only');
