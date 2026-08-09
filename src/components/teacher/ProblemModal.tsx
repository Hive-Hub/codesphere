import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { problemCreateSchema } from '../../utils/validation';
import { Problem } from '../../types/session';
import { teacherApi } from '../../services/teacherApi';
import { Modal } from '../common/Modal';
import { parseApiError } from '../../utils/errors';
import { BookOpen, ShieldAlert, Check, Save } from 'lucide-react';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: number;
  existingProblem?: Problem | null;
  onProblemSaved: (problem: Problem) => void;
}

export const ProblemModal: React.FC<ProblemModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  existingProblem,
  onProblemSaved,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Problem>({
    resolver: zodResolver(problemCreateSchema),
    defaultValues: existingProblem || {
      title: 'Two Sum Problem',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
      input_format: 'First line: Array of N integers\nSecond line: Target integer',
      output_format: 'Array of two indices [i, j]',
      sample_input: '[2, 7, 11, 15]\n9',
      sample_output: '[0, 1]',
      reference_solution: '# Teacher Reference Solution (Private - Never sent to students)\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []',
    },
  });

  const onSubmit = async (data: Problem) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await teacherApi.setProblem(sessionId, data);
      if (res.success && res.data) {
        onProblemSaved(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to post problem');
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Problem Statement">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            {error}
          </div>
        )}

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>Reference solutions are stored securely on the backend and are NEVER accessible to students.</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-200 block">Problem Title *</label>
          <input
            type="text"
            placeholder="Two Sum"
            {...register('title')}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.title && <p className="text-rose-400">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-200 block">Description *</label>
          <textarea
            rows={4}
            placeholder="Detailed problem description..."
            {...register('description')}
            className="w-full bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
          {errors.description && <p className="text-rose-400">{errors.description.message}</p>}
        </div>

        {/* Constraints & Formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-gray-200 block">Constraints</label>
            <textarea
              rows={2}
              placeholder="e.g. 1 <= N <= 10^5"
              {...register('constraints')}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-gray-200 block">Input Format</label>
            <textarea
              rows={2}
              placeholder="Input parameters..."
              {...register('input_format')}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Sample Input & Sample Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-gray-200 block">Sample Input</label>
            <textarea
              rows={2}
              placeholder="[2, 7, 11, 15]&#10;9"
              {...register('sample_input')}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-gray-200 block">Sample Output</label>
            <textarea
              rows={2}
              placeholder="[0, 1]"
              {...register('sample_output')}
              className="w-full bg-surface border border-border rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Reference Solution (Teacher Only) */}
        <div className="space-y-1 pt-2 border-t border-border">
          <label className="font-semibold text-indigo-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Reference Solution (Teacher Private)
          </label>
          <textarea
            rows={4}
            placeholder="def solution(): ..."
            {...register('reference_solution')}
            className="w-full bg-background border border-indigo-500/30 rounded-xl p-3 text-emerald-400 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-surface hover:bg-surface-hover text-gray-300 font-semibold rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting...' : 'Save Problem & Solution'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
