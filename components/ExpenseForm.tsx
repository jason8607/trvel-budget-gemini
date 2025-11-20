import React, { useState } from 'react';
import { Expense } from '../types';
import { CURRENCIES, CATEGORIES } from '../constants';
import { Check, X } from 'lucide-react';

interface ExpenseFormProps {
  onSave: (expense: Expense) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0].code);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      currency,
      category,
      date,
      description,
      timestamp: Date.now(),
    };

    onSave(newExpense);
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">新增消費</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Amount and Currency Row */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-500 mb-1">金額</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-2xl font-bold p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 placeholder-slate-300"
              placeholder="0.00"
              step="0.01"
              autoFocus
              required
            />
          </div>
          <div className="w-1/3">
            <label className="block text-sm font-medium text-slate-500 mb-1">幣別</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-[58px] p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 font-semibold"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">類別</label>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                  category === cat.id 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date and Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">備註</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：午餐、伴手禮..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-xl text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} /> 取消
          </button>
          <button
            type="submit"
            className="flex-1 py-4 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Check size={20} /> 儲存
          </button>
        </div>

      </form>
    </div>
  );
};

export default ExpenseForm;