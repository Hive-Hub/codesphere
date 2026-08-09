export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any> | null;
  error?: ApiErrorPayload | null;
}

export interface ApiErrorPayload {
  code: ApiErrorCode;
  message: string;
  details?: any[];
}

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_ROLL_NUMBER'
  | 'SESSION_INACTIVE'
  | 'INVALID_MODE'
  | 'LANGUAGE_MISMATCH'
  | 'CODE_TOO_LARGE'
  | 'INPUT_TOO_LARGE'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'AI_RATE_LIMITED'
  | 'COMPILER_UNAVAILABLE'
  | 'COMPILER_TIMEOUT'
  | 'INTERNAL_SERVER_ERROR';
