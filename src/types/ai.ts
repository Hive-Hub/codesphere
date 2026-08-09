export interface AIExplainErrorRequest {
  code: string;
  error_message: string;
  language: string;
}

export interface AIHintRequest {
  code: string;
  language: string;
  problem_description?: string;
}

export interface AIReviewRequest {
  code: string;
  language: string;
}

export interface AIResponse {
  summary: string;
  explanation?: string;
  hint?: string;
  suggestions?: string[];
  code_quality?: number;
  confidence?: number;
  current_stage?: string;
  is_stuck?: boolean;
}

export interface StudentAISummary {
  student_id: number;
  name: string;
  roll_number: string;
  progress: number;
  confidence: number;
  code_quality: number;
  current_stage: string;
  is_stuck: boolean;
  ai_summary: string;
  suggestions: string[];
}

export interface ClassAIOverview {
  avg_progress: number;
  avg_code_quality: number;
  avg_ai_score: number;
  stuck_students: StudentAISummary[];
  common_errors: { error: string; count: number }[];
  common_concepts: { concept: string; count: number }[];
  student_summaries: StudentAISummary[];
}
