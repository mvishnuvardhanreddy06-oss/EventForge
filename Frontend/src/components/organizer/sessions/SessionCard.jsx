import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Users,
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  XCircle,
  Calendar,
  Sparkles,
  Tag
} from 'lucide-react';
import SessionStatusBadge from './SessionStatusBadge';
import CapacityIndicator from './CapacityIndicator';

const TYPE_COLORS = {
  Keynote: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  Panel: 'bg-purple-50 text-purple-700 border-purple-200/70',
  Talk: 'bg-blue-50 text-blue-700 border-blue-200/70',
  Networking: 'bg-amber-50 text-amber-700 border-amber-200/70',
  Break: 'bg-slate-100 text-slate-700 border-slate-200'
};

const SessionCard = ({
  session,
  onView,
  onEdit,
  onDuplicate,
  onCancel,
  isSelected = false,
  onToggleSelect,
  showCheckbox = true
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const typeColor = TYPE_COLORS[session.type] || 'bg-blue-50 text-blue-700 border-blue-200/70';
  const speakerName = session.speaker?.name || session.speakerName || 'Speaker TBA';
  const speakerTitle = session.speaker?.designation || session.speakerTitle || '';
  const speakerCompany = session.speaker?.company || session.speakerCompany || '';
  const isCancelled = session.status === 'cancelled';

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md hover:border-slate-300 flex flex-col justify-between overflow-hidden relative ${
        isSelected
          ? 'ring-2 ring-blue-600 border-blue-300 bg-blue-50/10'
          : isCancelled
          ? 'border-slate-200/60 opacity-80'
          : 'border-slate-200/80'
      }`}
    >
      {/* Top Header Strip */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2">
            {showCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect?.(session.id || session._id)}
                className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            )}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeColor}`}
            >
              {session.type}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <SessionStatusBadge status={session.status} size="xs" />

            {/* Three-dot dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Session Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 z-30 mt-1 w-44 origin-top-right rounded-2xl bg-white p-1 shadow-xl ring-1 ring-black/5 border border-slate-100 focus:outline-none text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onView(session);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEdit(session);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Session</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDuplicate(session);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duplicate</span>
                  </button>

                  {!isCancelled && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onCancel(session);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-left"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Cancel Session</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time and Title */}
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 mb-1">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {session.startTime} – {session.endTime}
            </span>
          </div>

          <h3
            onClick={() => onView(session)}
            className={`text-sm font-black text-slate-900 tracking-tight leading-snug hover:text-blue-600 cursor-pointer transition-colors ${
              isCancelled ? 'line-through text-slate-400' : ''
            }`}
          >
            {session.title}
          </h3>
        </div>

        {/* Speaker Card / Information */}
        {session.type !== 'Break' && (
          <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
            <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold text-[11px] shrink-0 border border-blue-200/60 overflow-hidden">
              {session.speaker?.avatar || session.speakerAvatar ? (
                <img
                  src={session.speaker?.avatar || session.speakerAvatar}
                  alt={speakerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{speakerName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 truncate text-[11px]">{speakerName}</p>
              {(speakerTitle || speakerCompany) && (
                <p className="text-[10px] text-slate-400 truncate">
                  {speakerTitle} {speakerCompany ? `• ${speakerCompany}` : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Room & Location Info */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
          <span className="flex items-center space-x-1 font-semibold text-slate-700 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{session.room || session.roomName || 'Main Hall'}</span>
          </span>
        </div>

        {/* Capacity Indicator Meter */}
        {session.type !== 'Break' && (
          <CapacityIndicator
            capacity={session.capacity || 500}
            expectedAttendance={session.expectedAttendance || 420}
            showWarning={true}
          />
        )}

        {/* Tags */}
        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {session.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/50"
              >
                #{tag}
              </span>
            ))}
            {session.tags.length > 3 && (
              <span className="text-[10px] font-bold text-slate-400 self-center">
                +{session.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onView(session)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs transition-all"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(session)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 transition-all"
          >
            Edit
          </button>
        </div>

        <button
          type="button"
          onClick={() => onDuplicate(session)}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          title="Duplicate session"
        >
          <Copy className="w-3 h-3" />
          <span className="hidden sm:inline">Duplicate</span>
        </button>
      </div>
    </div>
  );
};

export default SessionCard;
