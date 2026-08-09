import { ApiErrorPayload, ApiErrorCode } from '../types/api';

const ERROR_MESSAGE_MAP: Record<ApiErrorCode | string, string> = {
  BAD_REQUEST: 'Invalid request parameters. Please check your entries.',
  VALIDATION_ERROR: 'Form validation failed. Please check the input fields.',
  DUPLICATE_ROLL_NUMBER: 'A student with this Roll Number has already joined this session.',
  SESSION_INACTIVE: 'This coding session is inactive or has been ended by the teacher.',
  INVALID_MODE: 'Selected mode is invalid for this coding session.',
  LANGUAGE_MISMATCH: 'Session language does not match your code execution environment.',
  CODE_TOO_LARGE: 'Code payload exceeds the maximum allowed size (64KB).',
  INPUT_TOO_LARGE: 'Input data exceeds the maximum allowed size.',
  UNAUTHORIZED: 'Session authorization token is missing or expired.',
  FORBIDDEN: 'You do not have permission to access this session resource.',
  NOT_FOUND: 'The requested session or resource was not found.',
  AI_RATE_LIMITED: 'AI request limit reached. Please wait a moment before trying again.',
  COMPILER_UNAVAILABLE: 'Online compiler service is currently unavailable. Please try again shortly.',
  COMPILER_TIMEOUT: 'Code execution timed out. Infinite loops or heavy computations are restricted.',
  INTERNAL_SERVER_ERROR: 'An unexpected server error occurred. Please try again.',
};

export function parseApiError(error: any): string {
  if (!error) return 'An unknown error occurred.';

  // Status code based fallback if network error or status specific
  const status = error.response?.status;
  if (status === 408) {
    return 'Execution timed out. Please optimize your code.';
  }
  if (status === 413) {
    return 'Payload too large. Please reduce the size of your code or input.';
  }
  if (status === 429) {
    return 'Rate limit exceeded. Please wait a few seconds before retrying.';
  }
  if (status === 503) {
    return 'Service temporarily unavailable. Please try again in a moment.';
  }

  // Check backend error JSON structure: { success: false, data: null, error: { code, message, details } }
  if (error.response?.data?.error) {
    const errPayload: ApiErrorPayload = error.response.data.error;

    let mainMessage = errPayload.message;
    if (!mainMessage && errPayload.code && ERROR_MESSAGE_MAP[errPayload.code]) {
      mainMessage = ERROR_MESSAGE_MAP[errPayload.code];
    }

    // Append details array items if provided by backend validation schemas
    if (errPayload.details && Array.isArray(errPayload.details) && errPayload.details.length > 0) {
      const detailsStr = errPayload.details
        .map((d: any) => (typeof d === 'string' ? d : JSON.stringify(d)))
        .join('; ');
      return `${mainMessage || 'Validation failed'}: ${detailsStr}`;
    }

    if (mainMessage) return mainMessage;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Unable to reach the server. Please verify your internet connection.';
    }
    return error.message;
  }

  return 'Failed to complete request. Please try again.';
}
