import React from 'react';
import { Layers, Clock, Eye, Edit2, MoreVertical } from 'lucide-react';
import SpeakerStatusBadge from './SpeakerStatusBadge';
import MaterialStatusBadge from './MaterialStatusBadge';
import AvailabilityBadge from './AvailabilityBadge';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop';

const SpeakerList = ({
  speakers = [],
  onViewProfile,
  onEdit,
  onAssignSession,
  onResendInvite,
  onRemove
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Speaker</th>
              <th className="py-3.5 px-3">Company</th>
              <th className="py-3.5 px-3">Event</th>
              <th className="py-3.5 px-3">Assigned Session</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-3 text-center">Availability</th>
              <th className="py-3.5 px-3">Materials</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {speakers.map((speaker) => {
              const fullName = speaker.name || `${speaker.firstName || ''} ${speaker.lastName || ''}`.trim();
              const avatar = speaker.profileImage || speaker.avatar || DEFAULT_AVATAR;
              const assignedSessions = speaker.sessions || speaker.assignedSessions || [];
              const primarySession = assignedSessions.length > 0 ? assignedSessions[0] : null;

              return (
                <tr
                  key={speaker.id || speaker._id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Speaker: Photo + Name + Designation */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/70">
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <p
                          onClick={() => onViewProfile(speaker)}
                          className="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer transition-colors"
                          title={fullName}
                        >
                          {fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {speaker.designation || 'Speaker'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 font-semibold">
                    {speaker.company || 'Enterprise'}
                  </td>

                  {/* Event */}
                  <td className="py-3.5 px-3 max-w-[180px] truncate text-slate-600">
                    {speaker.eventName || speaker.event || 'Global Tech Leadership Summit 2026'}
                  </td>

                  {/* Session */}
                  <td className="py-3.5 px-3 max-w-[220px]">
                    {primarySession ? (
                      <div className="truncate">
                        <p className="font-semibold text-blue-700 truncate" title={primarySession.title}>
                          {primarySession.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {primarySession.dateFormatted || 'Sep 24'} · {primarySession.time || '10:00 AM'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">
                        Not assigned
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <SpeakerStatusBadge status={speaker.status} size="xs" />
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <AvailabilityBadge availability={speaker.availability} size="xs" />
                  </td>

                  {/* Materials */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <MaterialStatusBadge status={speaker.materialStatus || speaker.materials?.status} size="xs" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onViewProfile(speaker)}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50/60 rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(speaker)}
                        className="px-2 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpeakerList;
