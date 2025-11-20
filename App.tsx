import React, { useState, useEffect } from 'react';
import { Expense, ViewState } from './types';
import { MOCK_DATA_IF_EMPTY } from './constants';
import { ExpensePieChart, ExpenseLineChart } from './components/Charts';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import AIAdvisor from './components/AIAdvisor';
import { PieChart as PieIcon, PlusCircle, List, Sparkles, Calendar, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('travel_expenses');
    return saved ? JSON.parse(saved) : MOCK_DATA_IF_EMPTY;
  });
  
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [filterDate, setFilterDate] = useState<string>(''); // '' implies All Time

  useEffect(() => {
    localStorage.setItem('travel_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    setFilterDate(expense.date); // Auto switch to the date of the new expense
    setView(ViewState.DASHBOARD);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Filter Logic
  const filteredExpenses = React.useMemo(() => {
    if (!filterDate) return expenses;
    return expenses.filter(e => e.date === filterDate);
  }, [expenses, filterDate]);

  const totalAmount = React.useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // Date Helpers
  const shiftDate = (days: number) => {
    const base = filterDate ? new Date(filterDate) : new Date();
    base.setDate(base.getDate() + days);
    setFilterDate(base.toISOString().split('T')[0]);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.ADD:
        return <ExpenseForm onSave={addExpense} onCancel={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.LIST:
        return (
          <div className="animate-in fade-in duration-300">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              {filterDate ? `${filterDate} 的支出` : '所有支出紀錄'}
            </h2>
            <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
          </div>
        );
      case ViewState.AI_ANALYSIS:
        return <AIAdvisor expenses={expenses} baseCurrency="TWD" />;
      case ViewState.DASHBOARD:
      default:
        return (
          <div className="space-y-6 animate-in fade-in duration-300 pb-2">
            {/* Total Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-400 text-sm font-medium">
                  {filterDate ? '當日總支出' : '總花費 (混合幣別)'}
                </p>
                {filterDate && (
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg">
                    {filterDate}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h1>
            </div>

            {/* Date Filter Control */}
            <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-200 flex items-center justify-between">
               <button onClick={() => shiftDate(-1)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg">
                 <ChevronLeft size={20} />
               </button>
               
               <div className="flex items-center gap-2">
                 <div className="relative">
                   <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                   />
                   <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Calendar size={16} className="text-indigo-500" />
                      {filterDate || "全部日期"}
                   </button>
                 </div>
                 {filterDate && (
                   <button onClick={() => setFilterDate('')} className="text-slate-400 hover:text-red-500">
                     <XCircle size={20} />
                   </button>
                 )}
               </div>

               <button onClick={() => shiftDate(1)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg">
                 <ChevronRight size={20} />
               </button>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-80">
                <h3 className="font-bold text-slate-700 mb-4">支出類別占比</h3>
                <div className="h-64">
                  <ExpensePieChart expenses={filteredExpenses} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-80">
                <h3 className="font-bold text-slate-700 mb-4">花費趨勢</h3>
                <div className="h-64">
                  <ExpenseLineChart expenses={expenses} /> 
                  {/* Note: Line chart always shows full history for context, even when filtered */}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-center relative">
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            ✈️ TravelSpend AI
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Standard Bottom Navigation - Fixed Grid */}
      <div className="fixed bottom-6 inset-x-0 mx-auto w-[95%] max-w-md z-50">
        <nav className="bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-100 p-2 grid grid-cols-4 gap-1">
          
          <button 
            onClick={() => setView(ViewState.DASHBOARD)}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${view === ViewState.DASHBOARD ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <PieIcon size={24} strokeWidth={view === ViewState.DASHBOARD ? 2.5 : 2} className="mb-1" />
            <span className="text-[11px] font-medium">總覽</span>
          </button>
          
          <button 
            onClick={() => setView(ViewState.LIST)}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${view === ViewState.LIST ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <List size={24} strokeWidth={view === ViewState.LIST ? 2.5 : 2} className="mb-1" />
            <span className="text-[11px] font-medium">列表</span>
          </button>

          <button 
            onClick={() => setView(ViewState.ADD)}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${view === ViewState.ADD ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <PlusCircle size={24} strokeWidth={view === ViewState.ADD ? 2.5 : 2} className="mb-1" />
            <span className="text-[11px] font-medium">記帳</span>
          </button>

           <button 
            onClick={() => setView(ViewState.AI_ANALYSIS)}
            className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 ${view === ViewState.AI_ANALYSIS ? 'bg-purple-50 text-purple-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <Sparkles size={24} strokeWidth={view === ViewState.AI_ANALYSIS ? 2.5 : 2} className="mb-1" />
            <span className="text-[11px] font-medium">分析</span>
          </button>

        </nav>
      </div>
    </div>
  );
};

export default App;