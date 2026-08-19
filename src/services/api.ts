import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://codesphere-backend-x1gl.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds to support Render free tier cold starts
});

// ─── Public endpoints that must NOT send Authorization ────────────────
const PUBLIC_ENDPOINT_PATTERNS = [
  '/teacher/session/create',
  '/student/session/join',
  '/session/validate',
  '/health',
];

function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINT_PATTERNS.some((pattern) => url.includes(pattern));
}

// ─── Safe methods for retry ───────────────────────────────────────────
const SAFE_RETRY_METHODS = new Set(['get', 'GET', 'head', 'HEAD', 'options', 'OPTIONS']);

function isSafeForRetry(config: InternalAxiosRequestConfig): boolean {
  return SAFE_RETRY_METHODS.has(config.method || '');
}

// ─── Request Interceptor ─────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (isPublicEndpoint(config.url)) {
      delete config.headers.Authorization;
      return config;
    }

    const activeRole = storage.getActiveRole();
    let token: string | null = null;

    if (activeRole === 'teacher') {
      token = storage.getTeacherToken() || sessionStorage.getItem('codesphere_teacher_token');
    } else if (activeRole === 'student') {
      token = storage.getStudentToken();
    } else {
      // Fallback: try both
      token = storage.getTeacherToken() || sessionStorage.getItem('codesphere_teacher_token') || storage.getStudentToken();
    }

    if (token && token !== 'undefined' && token !== 'null' && token.trim().length > 10) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    if (!config) return Promise.reject(error);

    const status = error.response?.status;

    // ── 401 Unauthorized: Don't infinite loop ──
    if (status === 401) {
      // Check if this is a session token issue — don't retry
      const errorData = error.response?.data as any;
      const errorCode = errorData?.error?.code;

      if (errorCode === 'SESSION_INACTIVE' || errorCode === 'UNAUTHORIZED') {
        // Don't retry — the token is genuinely invalid
        return Promise.reject(error);
      }

      // For other 401s, reject immediately (no refresh loop)
      return Promise.reject(error);
    }

    // ── 403 Forbidden: Never retry ──
    if (status === 403) {
      return Promise.reject(error);
    }

    // ── 404 Not Found: Never retry ──
    if (status === 404) {
      return Promise.reject(error);
    }

    // ── 408 Request Timeout: Surface to user ──
    if (status === 408) {
      return Promise.reject(error);
    }

    // ── 409 Conflict (e.g. duplicate roll number): Never retry ──
    if (status === 409) {
      return Promise.reject(error);
    }

    // ── 413 Payload Too Large: Never retry ──
    if (status === 413) {
      return Promise.reject(error);
    }

    // ── 429 Rate Limited: Don't auto-retry ──
    if (status === 429) {
      return Promise.reject(error);
    }

    // ── Network errors & cold start (502/503/504): Only retry safe methods ──
    const isNetworkOrColdStart =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      [502, 503, 504].includes(status || 0);

    if (isNetworkOrColdStart && isSafeForRetry(config)) {
      const retryCount = config._retryCount || 0;

      if (retryCount >= 2) {
        return Promise.reject(error);
      }

      config._retryCount = retryCount + 1;
      console.warn(`[Axios] Auto-retry #${config._retryCount} for GET ${config.url}`);

      // Wait before retrying (exponential backoff: 2s, 4s)
      await new Promise((resolve) => setTimeout(resolve, 2000 * config._retryCount));
      return apiClient(config);
    }

    // ── POST/PUT/DELETE on network error: Don't auto-retry (could duplicate) ──
    if (isNetworkOrColdStart && !isSafeForRetry(config)) {
      console.warn(`[Axios] Network error on non-idempotent ${config.method?.toUpperCase()} ${config.url} — not retrying`);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
