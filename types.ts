
export enum AppStep {
  INPUT = 'INPUT',
  ANALYSIS = 'ANALYSIS',
  GENERATION = 'GENERATION',
  FINISHED = 'FINISHED'
}

export interface AnalysisResponse {
  explanation: string;
}

export interface GenerationResponse {
  code: string;
}

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
}
