import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

const SecurityNotice = () => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-600 shadow-2xs">
      <div className="flex items-center space-x-2.5">
        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <span className="font-semibold text-slate-800">Audit logging is enabled.</span>
          <span className="text-slate-500 ml-1">
            Important platform activities are recorded for security, accountability and compliance purposes.
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 shrink-0 self-start sm:self-center pl-8 sm:pl-0">
        <Lock className="w-3 h-3 text-slate-400" />
        <span className="font-mono text-slate-400">Read-Only & Immutable</span>
      </div>
    </div>
  );
};

export default SecurityNotice;
