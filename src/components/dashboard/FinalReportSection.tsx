import React, { useState, useEffect } from 'react';
import { reportApi } from '../../services/reportApi';
import { teacherApi } from '../../services/teacherApi';
import { useSessionStore } from '../../store/sessionStore';
import { ReportStatusResponse } from '../../types/report';
import { parseApiError } from '../../utils/errors';
import { Modal } from '../common/Modal';
import { FileText, Download, AlertTriangle, CheckCircle, RefreshCw, StopCircle, Lock } from 'lucide-react';

export const FinalReportSection: React.FC<{ sessionId: number }> = ({ sessionId }) => {
  const { session, setSessionEnded } = useSessionStore();
  const [reportStatus, setReportStatus] = useState<ReportStatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [isEndingSession, setIsEndingSession] = useState<boolean>(false);
  const [showEndModal, setShowEndModal] = useState<boolean>(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'excel' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await reportApi.getStatus(sessionId);
      if (res.success && res.data) {
        setReportStatus(res.data);
      }
    } catch (err: any) {
      // If report endpoint pending or not generated yet
      setReportStatus({
        status: session?.status === 'ended' ? 'ready' : 'pending',
        pdf_available: session?.status === 'ended',
        excel_available: session?.status === 'ended',
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [sessionId, session?.status]);

  const handleEndSession = async () => {
    try {
      setIsEndingSession(true);
      setError(null);
      const res = await teacherApi.endSession(sessionId);
      if (res.success) {
        setSessionEnded(true, 'Teacher ended session');
        setShowEndModal(false);
        fetchStatus();
      }
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setIsEndingSession(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloadingFormat('pdf');
      await reportApi.downloadPdf(sessionId, session?.session_code || 'report');
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDownloadingFormat('excel');
      await reportApi.downloadExcel(sessionId, session?.session_code || 'report');
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleRetry = async () => {
    try {
      setLoadingStatus(true);
      await reportApi.retryReport(sessionId);
      fetchStatus();
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setLoadingStatus(false);
    }
  };

  const isEnded = session?.status === 'ended';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Card */}
      <div className="bg-surface-card p-6 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Final Session Reports & Analytics</h2>
              <p className="text-xs text-gray-400">Generate and export comprehensive PDF and Excel classroom performance reports</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEnded ? (
              <button
                onClick={() => setShowEndModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-rose-600/20"
              >
                <StopCircle className="w-4 h-4" />
                <span>End Session</span>
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold text-xs flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                SESSION ENDED
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Report Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* PDF Report Card */}
          <div className="bg-surface p-6 rounded-xl border border-border flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">PDF Document</span>
                <h3 className="text-lg font-bold text-white mt-1">Full Classroom PDF Report</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Complete analytics, student scores, code quality indices, and error logs in printable format.
                </p>
              </div>
              <FileText className="w-8 h-8 text-indigo-400 flex-shrink-0" />
            </div>

            <div>
              {!isEnded ? (
                <div className="p-3 bg-surface-card rounded-lg border border-border text-xs text-gray-400 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  PDF report will be generated when you end the session.
                </div>
              ) : (
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingFormat === 'pdf'}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${downloadingFormat === 'pdf' ? 'animate-bounce' : ''}`} />
                  <span>{downloadingFormat === 'pdf' ? 'Generating PDF...' : 'Download PDF Report'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Excel Report Card */}
          <div className="bg-surface p-6 rounded-xl border border-border flex flex-col justify-between space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Spreadsheet</span>
                <h3 className="text-lg font-bold text-white mt-1">Detailed Excel Dataset</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Raw telemetry, student rosters, execution metrics, and AI diagnostics for spreadsheet analysis.
                </p>
              </div>
              <FileText className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            </div>

            <div>
              {!isEnded ? (
                <div className="p-3 bg-surface-card rounded-lg border border-border text-xs text-gray-400 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Excel dataset will be generated when you end the session.
                </div>
              ) : (
                <button
                  onClick={handleDownloadExcel}
                  disabled={downloadingFormat === 'excel'}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${downloadingFormat === 'excel' ? 'animate-bounce' : ''}`} />
                  <span>{downloadingFormat === 'excel' ? 'Generating Excel...' : 'Download Excel Report'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Retry Button if failed */}
        {reportStatus?.status === 'failed' && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-between">
            <span className="text-xs font-medium">Report generation experienced an issue.</span>
            <button
              onClick={handleRetry}
              disabled={loadingStatus}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin' : ''}`} />
              Retry Report Generation
            </button>
          </div>
        )}
      </div>

      {/* End Session Confirmation Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Coding Session?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Are you sure you want to end this live session?
          </p>
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
            <li>Student code editors will be disabled immediately.</li>
            <li>New code executions and submissions will be locked.</li>
            <li>Final PDF & Excel classroom performance reports will be compiled.</li>
          </ul>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowEndModal(false)}
              className="px-4 py-2 bg-surface hover:bg-surface-hover text-gray-300 font-semibold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEndSession}
              disabled={isEndingSession}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {isEndingSession ? 'Ending Session...' : 'Confirm End Session'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
