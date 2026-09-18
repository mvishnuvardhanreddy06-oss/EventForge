import React from 'react';
import { AlertOctagon, RotateCcw, Database } from 'lucide-react';

const DangerZone = ({ onResetCache, onResetDemoData }) => {
  return (
    <div className="bg-rose-50/40 rounded-2xl border border-rose-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center space-x-2.5 text-rose-700">
        <AlertOctagon className="w-4 h-4 shrink-0" />
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
          Danger Zone
        </h4>
      </div>
      <p className="text-xs text-rose-900/80 leading-relaxed font-medium">
        Destructive administrative operations that affect caches or test datasets. Proceed with caution.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="bg-white rounded-xl border border-rose-200/60 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Reset Platform Cache
            </span>
            <span className="text-[11px] text-slate-500 leading-snug mt-0.5 block">
              Clears Redis query buffers and dynamic session templates.
            </span>
          </div>
          <button
            type="button"
            onClick={onResetCache}
            className="w-full py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer text-center"
          >
            Reset Cache
          </button>
        </div>

        <div className="bg-white rounded-xl border border-rose-200/60 p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Reset Demo Data
            </span>
            <span className="text-[11px] text-slate-500 leading-snug mt-0.5 block">
              Removes generated test mock events and attendee records.
            </span>
          </div>
          <button
            type="button"
            onClick={onResetDemoData}
            className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer text-center"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
