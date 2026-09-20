import React from 'react';
import { Activity, TrendingUp, CheckCircle, Percent } from 'lucide-react';

const AttendeeAnalyticsPreview = ({
  registrationRate = 82,
  paymentCompletion = 91,
  checkInRate = 69,
  cancellationRate = 4
}) => {
  const metrics = [
    {
      label: 'Registration Rate',
      value: `${registrationRate}%`,
      percentage: registrationRate,
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      description: 'Capacity utilization'
    },
    {
      label: 'Payment Completion',
      value: `${paymentCompletion}%`,
      percentage: paymentCompletion,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      description: 'Settled dues'
    },
    {
      label: 'Check-in Rate',
      value: `${checkInRate}%`,
      percentage: checkInRate,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-700',
      description: 'Onsite presence'
    },
    {
      label: 'Cancellation Rate',
      value: `${cancellationRate}%`,
      percentage: cancellationRate,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      description: 'Attrition / refunds'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            Attendee Pipeline Overview
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-400">
          Real-time metrics
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-slate-600 truncate">{m.label}</span>
              <span className={`font-mono font-bold text-xs ${m.textColor}`}>{m.value}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                style={{ width: `${Math.min(m.percentage, 100)}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-medium">{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeeAnalyticsPreview;
