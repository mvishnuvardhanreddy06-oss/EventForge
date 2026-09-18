import React from 'react';
import { Calendar, CheckCircle2, FileEdit, Award } from 'lucide-react';

const EventSummaryCards = ({ counts = { total: 12, published: 8, draft: 3, completed: 1 }, activeStatusFilter = 'all', onSelectFilter }) => {
  const cards = [
    {
      id: 'all',
      title: 'TOTAL EVENTS',
      count: counts.total || 0,
      icon: Calendar,
      color: 'text-slate-900',
      iconBg: 'bg-slate-100 text-slate-600',
      borderColor: activeStatusFilter === 'all' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200/80',
      tag: 'Apex Global Events'
    },
    {
      id: 'published',
      title: 'PUBLISHED',
      count: counts.published || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderColor: activeStatusFilter === 'published' ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200/80',
      tag: 'Live & Accepting'
    },
    {
      id: 'draft',
      title: 'DRAFTS',
      count: counts.draft || 0,
      icon: FileEdit,
      color: 'text-amber-600',
      iconBg: 'bg-amber-50 text-amber-600',
      borderColor: activeStatusFilter === 'draft' ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-slate-200/80',
      tag: 'In Preparation'
    },
    {
      id: 'completed',
      title: 'COMPLETED',
      count: counts.completed || 0,
      icon: Award,
      color: 'text-purple-600',
      iconBg: 'bg-purple-50 text-purple-600',
      borderColor: activeStatusFilter === 'completed' ? 'border-purple-600 ring-2 ring-purple-500/20' : 'border-slate-200/80',
      tag: 'Concluded'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeStatusFilter === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectFilter(isSelected && c.id !== 'all' ? 'all' : c.id)}
            className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all text-left flex flex-col justify-between cursor-pointer ${c.borderColor}`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {c.title}
                </span>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-black tracking-tight ${c.color}`}>
                {c.count}
              </p>
            </div>
            <div className="border-t border-slate-100 pt-2 mt-2">
              <span className="text-[11px] font-semibold text-slate-500 truncate block">
                {c.tag}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default EventSummaryCards;
