import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

const PublishChecklist = ({ isReady = false, missingItems = [], onPublish, onSaveDraft }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <ShieldCheck className={`w-5 h-5 ${isReady ? 'text-emerald-600' : 'text-amber-500'}`} />
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            Ready to Publish Verification
          </h4>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
            isReady
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isReady ? '● Ready to Publish' : '● Not Ready'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Basic event information & descriptions completed</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Event dates and venue allocation verified</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Registration policy & ticketing quotas established</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>At least one scheduled track session present</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Organizer tenant information verified (Apex Global Events)</span>
        </div>
      </div>

      {!isReady && missingItems.length > 0 && (
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center space-x-1.5 text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Complete the following before publishing:</span>
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
            {missingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={onSaveDraft}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
        >
          Save as Draft
        </button>

        <button
          type="button"
          disabled={!isReady}
          onClick={onPublish}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs hover:shadow transition-all"
        >
          Publish Event
        </button>
      </div>
    </div>
  );
};

export default PublishChecklist;
