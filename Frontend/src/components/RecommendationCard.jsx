import React from 'react';
import { Sparkles, Clock, MapPin, CheckCircle } from 'lucide-react';
import { formatTime } from '../utils/formatters';

const RecommendationCard = ({ recommendation, onSelect, isSelected = false }) => {
  const { session, matchScore, reason } = recommendation;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{matchScore}% Match</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {session.category || 'Specialized'}
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
          {session.title}
        </h4>

        {/* Recommendation Rationale */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 mb-4 leading-relaxed italic">
          "{reason}"
        </div>

        <div className="space-y-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{session.roomName || 'Main Auditorium'}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-700">
          {session.speakerId?.name || 'Keynote Speaker'}
        </div>
        <button
          onClick={() => onSelect && onSelect(session)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isSelected
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20'
          }`}
        >
          {isSelected ? 'Added to Agenda' : 'Add to Agenda'}
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
