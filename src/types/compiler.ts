export interface CodeRunPayload {
  language: 'python' | 'c' | 'java';
  code: string;
  stdin?: string;
}

export interface CodeSavePayload {
  code: string;
  language: 'python' | 'c' | 'java';
}

export interface CompilerResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  execution_time?: number; // in milliseconds or seconds
  memory?: number; // in bytes or MB
  status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout' | 'error';
  timestamp?: string;
}
