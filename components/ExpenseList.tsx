import React from 'react';
import { Expense } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2 } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  // Sort by date descending
  const sortedExpenses = [...expenses].sort((a, b) => b.timestamp - a.timestamp);

  if (sortedExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="text-4xl mb-4">💸</div>
        <p>目前沒有任何支出紀錄</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20">
      {sortedExpenses.map((expense) => {
        const category = CATEGORIES.find(c => c.id === expense.category) || CATEGORIES[5];
        return (
          <div 
            key={expense.id} 
            className="group relative bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-4 z-10">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${category.color}20` }} // 20% opacity background
              >
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{expense.description}</h3>
                <p className="text-xs text-slate-500">{expense.date} • {category.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 z-10">
              <div className="text-right">
                <span className="block font-bold text-slate-800">
                   {expense.currency} {expense.amount.toLocaleString()}
                </span>
              </div>
              
              <button 
                onClick={() => onDelete(expense.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete expense"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;