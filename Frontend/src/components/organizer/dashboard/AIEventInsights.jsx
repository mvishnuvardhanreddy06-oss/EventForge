import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

const AIEventInsights = () => {
  const insights = [
    {
      num: '01',
      title: 'Registration Momentum',
      text: 'Your Global Tech Leadership Summit has received 18% more registrations this week than last week.',
      icon: TrendingUp
    },
    {
      num: '02',
      title: 'Popular Session',
      text: '"AI Infrastructure at Scale" is currently attracting the highest number of session selections.',
      icon: Sparkles
    },
    {
      num: '03',
      title: 'Capacity Alert',
      text: 'Main Hall is approaching 90% expected capacity. Consider opening overflow seating.',
      icon: AlertTriangle
    },
    {
      num: '04',
      title: 'Speaker Recommendation',
      text: 'Based on attendee interests, consider adding an additional AI/Cloud focused session.',
      icon: Lightbulb
    }
  ];

  return (
    <div className="bg-gradient-to-b from-indigo-50/70 to-white rounded-2xl border border-indigo-200/70 p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI Event Insights</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          AI-Powered Recommendations
        </h3>
        <p className="text-xs text-slate-500">
          Automated event recommendations powered by Google Gemini.
        </p>
      </div>

      <div className="space-y-2.5">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div
              key={i}
              className="p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors space-y-1 shadow-2xs"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 text-indigo-600" />
                  <span>INSIGHT {ins.num} · {ins.title}</span>
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {ins.text}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        to="/organizer/ai-studio"
        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
      >
        <span>Open AI Event Assistant</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default AIEventInsights;
