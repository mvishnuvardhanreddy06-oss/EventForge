import React from 'react';
import { Award, CheckCircle2, DollarSign, Clock } from 'lucide-react';

const SponsorAnalytics = ({ sponsorMetrics = {} }) => {
  const {
    totalSponsorships = 0,
    sponsorCompletionRate = 100,
    totalDeliverables = 0,
    completedDeliverables = 0
  } = sponsorMetrics;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
        Sponsorship ROI & Milestone Health
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[11px] font-bold text-slate-400">Active Sponsors</p>
          <p className="text-xl font-black text-slate-900 mt-1">{totalSponsorships}</p>
        </div>
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[11px] font-bold text-slate-400">Deliverables Done</p>
          <p className="text-xl font-black text-blue-600 mt-1">{completedDeliverables} / {totalDeliverables}</p>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
          <span>Milestone Fulfillment</span>
          <span>{sponsorCompletionRate}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${sponsorCompletionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsorAnalytics;
