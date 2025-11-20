export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  description: string;
  timestamp: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface DailyData {
  date: string;
  amount: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ADD = 'ADD',
  LIST = 'LIST',
  AI_ANALYSIS = 'AI_ANALYSIS',
}

export interface AnalysisResult {
  summary: string;
  advice: string[];
  budgetStatus: 'good' | 'warning' | 'critical';
}