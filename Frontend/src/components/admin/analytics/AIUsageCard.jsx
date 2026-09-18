import React from 'react';
import { Sparkles, TrendingUp, Cpu, Compass, FileText } from 'lucide-react';

const AI_USAGE_ITEMS = [
  {
    title: 'AI Content Generation',
    count: 428,
    percentage: 45.7,
    subtitle: 'Promotional emails, session agendas, and speaker bios',
    icon: Sparkles,
    color: 'bg-blue-600'
  },
  {
    title: 'Session Recommendations',
    count: 312,
    percentage: 33.3,
    subtitle: 'Attendee interest-matching vectors and taxonomy scoring',
    icon: Compass,
    color: 'bg-purple-600'
  },
  {
    title: 'AI Summaries & Highlights',
    count: 196,
    percentage: 20.9,
    subtitle: 'Keynote key takeaways and schedule digest compilation',
    icon: FileText,
    color: 'bg-emerald-600'
  }
];

const AIUsageCard = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              AI Feature Usage
            </h3>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Gemini Engine</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Autonomous generative tasks and recommendation queries processed across all tenants.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">936</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +24.8%
          </span>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 flex overflow-hidden">
        <div className="bg-blue-600 h-full" style={{ width: '45.7%' }} title="Content Generation: 45.7%" />
        <div className="bg-purple-600 h-full" style={{ width: '33.3%' }} title="Recommendations: 33.3%" />
        <div className="bg-emerald-600 h-full" style={{ width: '21.0%' }} title="Summaries: 21.0%" />
      </div>

      {/* 3 Metric Sub-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {AI_USAGE_ITEMS.map((item) => {
          const IconComp = item.icon;
          return (
            <div key={item.title} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800">
                  <IconComp className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.title}</span>
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono">{item.count}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {item.subtitle}
              </p>
              <div className="text-[10px] font-semibold text-slate-400 pt-0.5">
                {item.percentage}% of platform AI volume
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIUsageCard;
