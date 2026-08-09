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
  stdout?: string;
  stderr?: string;
  output?: string;
  error?: string;
  exit_code: number;
  execution_time?: string | number;
  memory?: string | number;
  status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout' | 'error' | 'failed';
  timestamp?: string;
}
