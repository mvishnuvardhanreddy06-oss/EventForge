import React from 'react';

const RevenueBreakdown = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Revenue Distribution
          </span>
          <h4 className="text-sm font-bold text-slate-900">
            Monthly Breakdown
          </h4>
        </div>
        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/80 font-mono">
          ₹2,48,500 Total
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="font-semibold text-slate-700">Pro Revenue</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">₹1,24,975</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '50.3%' }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="font-semibold text-slate-700">Enterprise Revenue</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">₹1,23,525</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '49.7%' }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="font-semibold text-slate-700">Free Tier</span>
            </div>
            <span className="font-bold text-slate-400 font-mono">₹0</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Active paying plans</span>
        <span className="font-semibold text-slate-700">19 Organizations</span>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
