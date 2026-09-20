import React from 'react';
import {
  X,
  Clock,
  MapPin,
  Users,
  Calendar,
  User,
  Edit2,
  Copy,
  XCircle,
  Tag,
  CheckCircle2,
  ExternalLink
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

const SessionDetailsDrawer = ({
  isOpen,
  onClose,
  session,
  onEdit,
  onDuplicate,
  onCancel
}) => {
  if (!isOpen || !session) return null;

  const typeColor = TYPE_COLORS[session.type] || 'bg-blue-50 text-blue-700 border-blue-200/70';
  const speakerName = session.speaker?.name || session.speakerName || 'Speaker TBA';
  const speakerTitle = session.speaker?.designation || session.speakerTitle || 'Executive Guest';
  const speakerCompany = session.speaker?.company || session.speakerCompany || 'TechNova';
  const isCancelled = session.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${typeColor}`}>
                {session.type}
              </span>
              <SessionStatusBadge status={session.status} size="sm" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
            {/* Session Title & Timing */}
            <div className="space-y-2">
              <h2 className={`text-xl font-black text-slate-900 tracking-tight leading-snug ${isCancelled ? 'line-through text-slate-400' : ''}`}>
                {session.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-blue-700 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{session.dateFormatted || session.date || 'September 24, 2026'}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{session.startTime} – {session.endTime}</span>
                </span>
              </div>
            </div>

            {/* Room & Capacity Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Assigned Room
                  </p>
                  <p className="text-sm font-bold text-slate-900 flex items-center space-x-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{session.room || session.roomName || 'Main Hall'}</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                  Level 1 • Pillarless
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <CapacityIndicator
                  capacity={session.capacity || 500}
                  expectedAttendance={session.expectedAttendance || 420}
                />
              </div>
            </div>

            {/* Speaker Information Card */}
            {session.type !== 'Break' && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Featured Speaker
                </h4>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center shrink-0 border border-blue-200 overflow-hidden">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {speakerName}
                      </p>
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Confirmed</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {speakerTitle} • {speakerCompany}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {session.speakerBio ||
                        'Recognized authority and keynote presenter in distributed computing, modern cloud frameworks, and AI governance.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Session Description & Syllabus
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  {session.description ||
                    'Explore how modern AI infrastructure can be designed for enterprise-scale workloads, focusing on latency, reliability, and security compliance.'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {session.tags && session.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Session Topic Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {session.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onEdit(session)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Session</span>
              </button>

              <button
                type="button"
                onClick={() => onDuplicate(session)}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
            </div>

            {!isCancelled && (
              <button
                type="button"
                onClick={() => onCancel(session)}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsDrawer;
