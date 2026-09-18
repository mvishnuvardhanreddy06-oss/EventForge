import React from 'react';
import { Sparkles, Crown, Shield } from 'lucide-react';

const PlanBadge = ({ plan }) => {
  const normalized = (plan || 'free').toLowerCase();

  if (normalized === 'enterprise') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
        <Crown className="w-3 h-3 text-indigo-600 shrink-0" />
        <span>Enterprise</span>
      </span>
    );
  }

  if (normalized === 'pro') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
        <Sparkles className="w-3 h-3 text-blue-600 shrink-0" />
        <span>Pro</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
      <Shield className="w-3 h-3 text-slate-400 shrink-0" />
      <span>Free</span>
    </span>
  );
};

export default PlanBadge;
