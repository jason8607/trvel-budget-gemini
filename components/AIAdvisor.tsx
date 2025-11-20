import React, { useState } from 'react';
import { analyzeExpenses } from '../services/geminiService';
import { Expense, AnalysisResult } from '../types';
import { Sparkles, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface AIAdvisorProps {
  expenses: Expense[];
  baseCurrency: string;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ expenses, baseCurrency }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeExpenses(expenses, baseCurrency);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'critical': return <AlertCircle size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return '預算控制良好';
      case 'warning': return '請注意支出';
      case 'critical': return '花費偏高';
      default: return '預算分析';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-300" />
          <h2 className="text-xl font-bold">AI 旅遊消費顧問</h2>
        </div>
        <p className="text-indigo-100 text-sm mb-6">
          透過 Gemini 分析您的旅遊消費習慣，並提供省錢建議。
        </p>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              分析中...
            </>
          ) : (
            <>產生分析報告</>
          )}
        </button>
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className={`p-4 rounded-xl border ${getStatusColor(analysis.budgetStatus)}`}>
            <div className="flex items-center gap-2 font-bold mb-2 capitalize">
              {getStatusIcon(analysis.budgetStatus)}
              {getStatusText(analysis.budgetStatus)}
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Advice List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 p-1 rounded text-xs">TIPS</span>
              聰明建議
            </h3>
            <ul className="space-y-3">
              {analysis.advice.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600">
                  <span className="font-bold text-indigo-400 select-none">{idx + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;