import React from 'react';
import { Clock, MapPin, User, FileText, Download } from 'lucide-react';
import { formatTime, formatDate } from '../utils/formatters';

const SessionCard = ({ session, onSelect, isSelected = false, showSelectButton = false }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${isSelected ? 'border-blue-600 bg-blue-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            {session.category || 'General Track'}
          </span>
          <h4 className="text-sm font-bold text-slate-900 leading-snug">{session.title}</h4>
        </div>
        {showSelectButton && (
          <button
            onClick={() => onSelect && onSelect(session)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSelected ? 'Selected' : 'Add to Agenda'}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
        {session.description}
      </p>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 mb-3">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold">{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{session.roomName || 'Main Auditorium'}</span>
        </div>
      </div>

      {/* Speaker Info */}
      {session.speakerId && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">
              {session.speakerId.name?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{session.speakerId.name}</p>
              <p className="text-[10px] text-slate-400">{session.speakerId.designation || 'Speaker'} • {session.speakerId.company || ''}</p>
            </div>
          </div>

          {session.materials && session.materials.length > 0 && (
            <a
              href={session.materials[0].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
            >
              <Download className="w-3 h-3" />
              <span>Slides</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCard;
