import React from 'react';
import { Clock, MapPin, User, FileText, Download } from 'lucide-react';
import { formatTime, formatDate } from '../utils/formatters';

const SessionCard = ({ session, onSelect, isSelected = false, showSelectButton = false }) => {
  return (
    <div className={`slot flex flex-col justify-between transition-all ${isSelected ? 'border-accent bg-accent/5 ring-2 ring-accent/30' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="chip !py-0.5 !px-2.5 text-[10px] font-bold !bg-accent/10 !text-accent !border-accent/20 mb-1.5">
            {session.category || 'General Track'}
          </span>
          <h4 className="text-sm font-display font-bold text-ink leading-snug">{session.title}</h4>
        </div>
        {showSelectButton && (
          <button
            onClick={() => onSelect && onSelect(session)}
            className={`!py-1 !px-3 text-xs font-bold transition-colors cursor-pointer ${
              isSelected ? 'btn-primary' : 'btn'
            }`}
          >
            {isSelected ? 'Selected' : 'Add to Agenda'}
          </button>
        )}
      </div>

      <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed">
        {session.description}
      </p>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted mb-3">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-muted" />
          <span className="font-semibold text-ink">{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-muted" />
          <span>{session.roomName || 'Main Auditorium'}</span>
        </div>
      </div>

      {/* Speaker Info */}
      {session.speakerId && (
        <div className="pt-3 border-t border-line flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
              {session.speakerId.name?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="text-xs font-bold text-ink">{session.speakerId.name}</p>
              <p className="text-[10px] text-muted">{session.speakerId.designation || 'Speaker'} • {session.speakerId.company || ''}</p>
            </div>
          </div>

          {session.materials && session.materials.length > 0 && (
            <a
              href={session.materials[0].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-accent hover:underline"
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
