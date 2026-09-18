import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

const ActivityTimeline = ({ timeline, status }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const isFailed = (status || '').toLowerCase() === 'failed';

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>Activity Timeline</span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((item, idx) => {
          const isLast = idx === timeline.length - 1;
          return (
            <div key={idx} className="relative group">
              {/* Dot indicator */}
              <div
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                  isLast && isFailed
                    ? 'border-rose-500 text-rose-600'
                    : isLast
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-blue-500 text-blue-600'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLast && isFailed
                      ? 'bg-rose-500'
                      : isLast
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                />
              </div>

              {/* Timestamp & Step */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 text-xs">
                <span className="font-semibold text-slate-800">{item.step}</span>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {item.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
