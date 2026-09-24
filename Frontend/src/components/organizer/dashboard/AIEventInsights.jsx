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
    <div className="panel bg-gradient-to-b from-accent/5 to-surface space-y-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-accent font-bold text-xs">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>AI Event Insights</span>
        </div>
        <h3 className="text-base font-display font-bold text-ink tracking-tight">
          AI-Powered Recommendations
        </h3>
        <p className="text-xs text-muted">
          Automated event recommendations powered by Google Gemini.
        </p>
      </div>

      <div className="space-y-2.5">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div
              key={i}
              className="p-3 bg-surface rounded-xl border border-line hover:border-accent/40 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-accent">
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 text-accent" />
                  <span>INSIGHT {ins.num} · {ins.title}</span>
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed font-medium">
                {ins.text}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        to="/organizer/ai-studio"
        className="btn-primary w-full py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
      >
        <span>Open AI Event Assistant</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default AIEventInsights;
