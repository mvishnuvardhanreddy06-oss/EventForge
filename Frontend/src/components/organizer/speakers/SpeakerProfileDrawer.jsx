import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Globe,
  Linkedin,
  MapPin,
  Calendar,
  Clock,
  Layers,
  Award,
  Tag,
  Edit2,
  Send,
  PlusCircle,
  Trash2,
  CheckCircle2,
  FileText,
  Camera,
  RefreshCw,
  Building
} from 'lucide-react';
import SpeakerStatusBadge from './SpeakerStatusBadge';
import AvailabilityBadge from './AvailabilityBadge';
import MaterialStatusBadge from './MaterialStatusBadge';
import SpeakerMaterials from './SpeakerMaterials';
import InvitationTrackingCard from './InvitationTrackingCard';

const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg';

const SpeakerProfileDrawer = ({
  isOpen,
  onClose,
  speaker,
  onEdit,
  onAssignSession,
  onResendInvite,
  onRemove,
  onUnassignSession,
  onUploadMaterial,
  onReviewMaterial
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !speaker) return null;

  const fullName = speaker.name || `${speaker.firstName || ''} ${speaker.lastName || ''}`.trim();
  const isVirat = /virat|kholi|kohli/i.test(fullName);
  const avatar = isVirat
    ? 'https://upload.wikimedia.org/wikipedia/commons/1/15/Virat_Kohli_portrait.jpg'
    : (speaker.profileImage || speaker.avatar || DEFAULT_AVATAR);
  const assignedSessions = speaker.sessions || speaker.assignedSessions || [];
  const eventName = speaker.eventName || speaker.event || 'Global Tech Leadership Summit 2026';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md">
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight truncate" title={fullName}>
                    {fullName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {speaker.designation || 'Cloud Architect'}
                  </p>
                  <p className="text-xs text-blue-600 font-bold truncate">
                    {speaker.company || 'TechNova'}
                  </p>
                  <div className="mt-1.5 flex items-center space-x-2">
                    <SpeakerStatusBadge status={speaker.status} size="xs" />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => onEdit(speaker)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Speaker</span>
              </button>

              <button
                type="button"
                onClick={() => onAssignSession(speaker)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Assign Session</span>
              </button>

              {(speaker.status === 'pending' || speaker.status === 'invited') && (
                <button
                  type="button"
                  onClick={() => onResendInvite(speaker)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Resend Invitation</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemove(speaker)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 ml-auto transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center space-x-4 mt-4 -mb-5 border-b border-slate-200">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'sessions', label: `Assigned Sessions (${assignedSessions.length})` },
                { id: 'materials', label: 'Materials' },
                { id: 'invitation', label: 'Invitation Tracking' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-xs font-bold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
            {activeTab === 'overview' && (
              <div className="space-y-6 divide-y divide-slate-100">
                {/* BIO */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    BIO
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {speaker.bio ||
                      'Sarah is a cloud architecture specialist with experience designing enterprise-scale infrastructure.'}
                  </p>
                </div>

                {/* CONTACT */}
                <div className="space-y-2 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    CONTACT
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 block">Email</span>
                      <a href={`mailto:${speaker.email}`} className="font-bold text-slate-900 hover:text-blue-600">
                        {speaker.email || 'sarah@example.com'}
                      </a>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 block">Phone</span>
                      <span className="font-bold text-slate-900">
                        {speaker.phone || '+91 XXXXX XXXXX'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXPERTISE */}
                <div className="space-y-2 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    EXPERTISE
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(speaker.expertise || speaker.topics || [
                      'AI',
                      'Cloud',
                      'Infrastructure',
                      'Enterprise Architecture'
                    ]).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* EVENTS */}
                <div className="space-y-2 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    EVENTS
                  </h4>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center space-x-2">
                    <Building className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-900">{eventName}</span>
                  </div>
                </div>

                {/* ASSIGNED SESSIONS */}
                <div className="space-y-2 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ASSIGNED SESSIONS
                  </h4>
                  {assignedSessions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No sessions assigned yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {assignedSessions.map((ses, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                        >
                          <p className="font-bold text-slate-900">{ses.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {ses.dateFormatted || 'Sep 24'} · {ses.time || '10:00 AM'} {ses.room ? `· ${ses.room}` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AVAILABILITY */}
                <div className="space-y-2 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    AVAILABILITY
                  </h4>
                  <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <AvailabilityBadge availability={speaker.availability} size="sm" />
                    <span className="text-xs text-slate-600">
                      Available during scheduled session hours
                    </span>
                  </div>
                </div>

                {/* MATERIALS */}
                <div className="space-y-2 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    MATERIALS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Presentation Uploaded</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bio Submitted</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-800 font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Profile Photo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Assigned Sessions ({assignedSessions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => onAssignSession(speaker)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Assign Session</span>
                  </button>
                </div>

                {assignedSessions.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">No sessions assigned yet</p>
                    <p className="text-[11px] text-slate-400">
                      Assign {fullName} to an agenda session to schedule speaking slots.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignedSessions.map((session, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {session.type || 'Keynote'}
                            </span>
                            <h5 className="font-bold text-slate-900 text-sm mt-1.5">
                              {session.title}
                            </h5>
                          </div>
                          {onUnassignSession && (
                            <button
                              type="button"
                              onClick={() => onUnassignSession(speaker.id || speaker._id, session.id || session._id)}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                            >
                              Unassign
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                          <span>{session.dateFormatted || 'Sep 24, 2026'}</span>
                          <span>•</span>
                          <span>{session.time || '10:00 AM – 11:15 AM'}</span>
                          {session.room && (
                            <>
                              <span>•</span>
                              <span>{session.room}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <SpeakerMaterials
                materials={speaker.materials || {}}
                speakerName={fullName}
                onUploadMaterial={onUploadMaterial}
                onReviewMaterial={onReviewMaterial}
              />
            )}

            {activeTab === 'invitation' && (
              <InvitationTrackingCard
                speaker={speaker}
                onResendInvite={onResendInvite}
              />
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onEdit(speaker)}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Speaker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerProfileDrawer;
