import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { reportApi, ReportJobData, GenerateReportPayload } from '../../services/reportApi';
import { teacherApi } from '../../services/teacherApi';
import {
  FileText, Calendar, Download, Loader2, RefreshCw, CheckCircle2, AlertCircle, ArrowLeft, Filter, FileSpreadsheet
} from 'lucide-react';

export const TeacherReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<'today' | 'monthly' | 'custom' | 'session' | 'student'>('today');
  const [month, setMonth] = useState<string>('2026-08');
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [endDate, setEndDate] = useState<string>('2026-08-12');
  const [sessionId, setSessionId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');

  const [activeJob, setActiveJob] = useState<ReportJobData | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportJobData[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await reportApi.getReportHistoryV2();
      if (res.success && res.data?.reports) {
        setReportHistory(res.data.reports);
      }
    } catch (e) {
      console.warn('Report history fetch error:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerate = async (format: 'pdf' | 'excel') => {
    setError(null);

    // Validation
    if (filterType === 'custom') {
      if (!startDate || !endDate) {
        setError('Please select both Start Date and End Date for custom report.');
        return;
      }
      if (startDate > endDate) {
        setError('Start Date cannot be later than End Date.');
        return;
      }
    }

    if (filterType === 'session' && !sessionId) {
      setError('Please enter a Session ID.');
      return;
    }

    if (filterType === 'student' && !studentId) {
      setError('Please enter a Student ID.');
      return;
    }

    const payload: GenerateReportPayload = {
      filter_type: filterType,
      format: format,
      month: filterType === 'monthly' ? month : undefined,
      start_date: filterType === 'custom' ? startDate : undefined,
      end_date: filterType === 'custom' ? endDate : undefined,
      session_id: filterType === 'session' ? parseInt(sessionId, 10) : undefined,
      student_id: filterType === 'student' ? parseInt(studentId, 10) : undefined,
    };

    setIsGenerating(true);
    try {
      const res = await reportApi.generateReportV2(payload);
      if (res.success && res.data) {
        setActiveJob(res.data);
        if (res.data.status === 'ready') {
          setIsGenerating(false);
          fetchHistory();
          // Trigger immediate download
          await reportApi.downloadJobReportV2(res.data.job_id, format);
        } else {
          // Poll for completion
          pollJobStatus(res.data.job_id, format);
        }
      } else {
        setError(res.message || 'Report generation failed');
        setIsGenerating(false);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || err?.message || 'Report generation failed');
      setIsGenerating(false);
    }
  };

  const pollJobStatus = (jobId: string, format: 'pdf' | 'excel') => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await reportApi.getJobStatusV2(jobId);
        if (res.success && res.data) {
          setActiveJob(res.data);
          if (res.data.status === 'ready') {
            clearInterval(interval);
            setIsGenerating(false);
            fetchHistory();
            await reportApi.downloadJobReportV2(jobId, format);
          } else if (res.data.status === 'failed') {
            clearInterval(interval);
            setIsGenerating(false);
            setError(res.data.error_message || 'Report background job failed');
          }
        }
      } catch (e) {
        console.warn('Poll error:', e);
      }

      if (attempts >= 15) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-border pb-6">
          <button
            onClick={() => navigate('/teacher/home')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard Home</span>
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Any-Time Classroom Reports Generator V2</span>
          </h1>
          <p className="text-xs text-gray-400">Generate PDF and Excel reports for Today, This Month, Custom Ranges, or specific sessions/students</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter Selection Panel */}
        <div className="bg-surface-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Report Filter</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'today', label: 'Today' },
                { id: 'monthly', label: 'This Month' },
                { id: 'custom', label: 'Custom Range' },
                { id: 'session', label: 'Specific Session' },
                { id: 'student', label: 'Specific Student' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                    filterType === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-surface hover:bg-surface-hover text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Inputs */}
          {filterType === 'monthly' && (
            <div className="space-y-2 max-w-xs">
              <label className="text-xs text-gray-400 font-semibold">Select Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {filterType === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-semibold">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-semibold">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {filterType === 'session' && (
            <div className="space-y-2 max-w-xs">
              <label className="text-xs text-gray-400 font-semibold">Session ID</label>
              <input
                type="number"
                placeholder="e.g. 1"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {filterType === 'student' && (
            <div className="space-y-2 max-w-xs">
              <label className="text-xs text-gray-400 font-semibold">Student ID</label>
              <input
                type="number"
                placeholder="e.g. 42"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Export Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border">
            <button
              onClick={() => handleGenerate('pdf')}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>Generate PDF Report</span>
            </button>

            <button
              onClick={() => handleGenerate('excel')}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              <span>Generate Excel Report (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Active Generation Job Status Banner */}
        {activeJob && (
          <div className="bg-surface-card border border-border rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span>Job Status:</span>
                <span className={`capitalize ${activeJob.status === 'ready' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {activeJob.status === 'ready' ? 'Ready' : activeJob.status === 'processing' ? 'Generating...' : activeJob.status}
                </span>
              </span>
              {activeJob.status === 'processing' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
            </div>

            {activeJob.status === 'ready' && (
              <div className="flex items-center gap-3 pt-2">
                {activeJob.has_pdf && (
                  <button
                    onClick={() => reportApi.downloadJobReportV2(activeJob.job_id, 'pdf')}
                    className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                )}
                {activeJob.has_excel && (
                  <button
                    onClick={() => reportApi.downloadJobReportV2(activeJob.job_id, 'excel')}
                    className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Excel
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Previous Reports History Table */}
        <div className="bg-surface-card border border-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Previous Reports History</h2>
            <button onClick={fetchHistory} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-8 text-center text-gray-500 text-xs">Loading report history...</div>
          ) : reportHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-xs">No previous report jobs generated yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-gray-400 uppercase tracking-wider text-[10px] bg-surface/50">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Filter Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Downloads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-gray-300">
                  {reportHistory.map((job) => (
                    <tr key={job.job_id} className="hover:bg-surface-hover/50">
                      <td className="py-2.5 px-3 whitespace-nowrap text-gray-400">
                        {job.created_at ? new Date(job.created_at).toLocaleString('en-GB') : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-white capitalize">{job.filter_type}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            job.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right flex items-center justify-end gap-2">
                        {job.has_pdf && (
                          <button
                            onClick={() => reportApi.downloadJobReportV2(job.job_id, 'pdf')}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[11px] font-semibold"
                          >
                            PDF
                          </button>
                        )}
                        {job.has_excel && (
                          <button
                            onClick={() => reportApi.downloadJobReportV2(job.job_id, 'excel')}
                            className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-semibold"
                          >
                            Excel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
