import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Calendar,
  Layers,
  FileText,
  Clock,
  Eye,
  Edit2,
  Send,
  PlusCircle,
  Trash2,
  ExternalLink,
  Linkedin
} from 'lucide-react';
import SpeakerStatusBadge from './SpeakerStatusBadge';
import MaterialStatusBadge from './MaterialStatusBadge';
import AvailabilityBadge from './AvailabilityBadge';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop';

const SpeakerCard = ({
  speaker,
  onViewProfile,
  onEdit,
  onAssignSession,
  onResendInvite,
  onRemove
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

  const fullName = speaker.name || `${speaker.firstName || ''} ${speaker.lastName || ''}`.trim();
  const avatar = speaker.profileImage || speaker.avatar || DEFAULT_AVATAR;
  const assignedSessions = speaker.sessions || speaker.assignedSessions || [];
  const primarySession = assignedSessions.length > 0 ? assignedSessions[0] : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-4 sm:p-5 space-y-4">
        {/* Top Header: Avatar + Status + More Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
              <img
                src={avatar}
                alt={fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
            </div>

            <div className="min-w-0">
              <h3
                onClick={() => onViewProfile(speaker)}
                className="text-sm font-black text-slate-900 tracking-tight leading-snug truncate hover:text-blue-600 cursor-pointer transition-colors"
                title={fullName}
              >
                {fullName}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5" title={speaker.designation}>
                {speaker.designation || 'Keynote Speaker'}
              </p>
              <p className="text-[11px] font-semibold text-blue-600 truncate">
                {speaker.company || 'Enterprise Partner'}
              </p>
            </div>
          </div>

          {/* Three-dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Speaker Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-30 mt-1 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-100 focus:outline-none text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onViewProfile(speaker);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(speaker);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onAssignSession(speaker);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assign Session</span>
                </button>

                {(speaker.status === 'pending' || speaker.status === 'invited') && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onResendInvite(speaker);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-blue-600 hover:bg-blue-50/60 font-semibold text-left"
                  >
                    <Send className="w-3.5 h-3.5 text-blue-500" />
                    <span>Resend Invitation</span>
                  </button>
                )}

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRemove(speaker);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-left"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Remove from Event</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Strip: Speaker Status & Availability */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <SpeakerStatusBadge status={speaker.status} size="xs" />
          <AvailabilityBadge availability={speaker.availability} size="xs" />
        </div>

        {/* Assigned Session Box */}
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <Layers className="w-3 h-3 text-blue-600" />
              <span>Assigned Session</span>
            </span>
            {assignedSessions.length > 1 && (
              <span className="text-blue-600 font-extrabold">
                +{assignedSessions.length - 1} more
              </span>
            )}
          </div>

          {primarySession ? (
            <div className="pt-0.5">
              <p className="font-bold text-slate-900 truncate" title={primarySession.title}>
                {primarySession.title}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{primarySession.dateFormatted || 'Sep 24'} · {primarySession.time || '10:00 AM'}</span>
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic pt-0.5">
              No session assigned yet
            </p>
          )}
        </div>

        {/* Presentation Material Status */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Materials
          </span>
          <MaterialStatusBadge status={speaker.materialStatus || speaker.materials?.status} size="xs" />
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(speaker)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50/60 border border-slate-200/80 shadow-2xs transition-all"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onEdit(speaker)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 transition-all"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default SpeakerCard;
