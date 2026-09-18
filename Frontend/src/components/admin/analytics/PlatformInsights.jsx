import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

const INSIGHTS = [
  {
    id: 1,
    highlight: 'Attendee registrations increased 18.7% this month',
    detail: 'Driven by Global AI & Cloud Summit marketing campaigns across LinkedIn and enterprise channels.'
  },
  {
    id: 2,
    highlight: 'Pro organizations generated the highest event activity',
    detail: 'Apex Global Events and Nexus Tech Summits account for over 73% of active live attendee check-ins.'
  },
  {
    id: 3,
    highlight: 'Attendees represent 55% of all platform users',
    detail: 'High engagement recorded with personalized AI session agendas and ticket QR pass access.'
  },
  {
    id: 4,
    highlight: 'Registration activity is strongest during weekday evenings',
    detail: 'Peak ticket checkout activity consistently observed between 6:00 PM and 9:00 PM EST.'
  }
];

const PlatformInsights = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 overflow-hidden space-y-3.5">
      <div>
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Platform Insights
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Automated telemetry observations compiled from platform activity metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INSIGHTS.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 flex items-start space-x-2.5 transition-colors hover:bg-blue-50/50"
          >
            <span className="text-sm shrink-0 mt-0.5">💡</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {item.highlight}
              </p>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformInsights;
