import React from 'react';
import {
  Clock,
  MapPin,
  User,
  Users,
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  XCircle
} from 'lucide-react';
import SessionStatusBadge from './SessionStatusBadge';

const TYPE_COLORS = {
  Keynote: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  Panel: 'bg-purple-50 text-purple-700 border-purple-200/70',
  Talk: 'bg-blue-50 text-blue-700 border-blue-200/70',
  Networking: 'bg-amber-50 text-amber-700 border-amber-200/70',
  Break: 'bg-slate-100 text-slate-700 border-slate-200'
};

const SessionList = ({
  sessions = [],
  onView,
  onEdit,
  onDuplicate,
  onCancel,
  selectedSessionIds = [],
  onToggleSelect,
  onSelectAll
}) => {
  const isAllSelected = sessions.length > 0 && selectedSessionIds.length === sessions.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3">Session Title</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Time</th>
              <th className="py-3.5 px-3">Speaker</th>
              <th className="py-3.5 px-3">Room</th>
              <th className="py-3.5 px-3 text-right">Capacity</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const isSelected = selectedSessionIds.includes(session.id || session._id);
              const typeColor = TYPE_COLORS[session.type] || 'bg-blue-50 text-blue-700 border-blue-200/70';
              const speakerName = session.speaker?.name || session.speakerName || 'Speaker TBA';
              const isCancelled = session.status === 'cancelled';
              const percent = Math.min(
                Math.round(((session.expectedAttendance || 420) / (session.capacity || 500)) * 100),
                100
              );

              return (
                <tr
                  key={session.id || session._id}
                  className={`hover:bg-slate-50/60 transition-colors group ${
                    isSelected ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(session.id || session._id)}
                      className="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* Title & Tags */}
                  <td className="py-3.5 px-3 max-w-[240px]">
                    <div className="space-y-0.5">
                      <p
                        onClick={() => onView(session)}
                        className={`font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer transition-colors ${
                          isCancelled ? 'line-through text-slate-400' : ''
                        }`}
                        title={session.title}
                      >
                        {session.title}
                      </p>
                      {session.tags && session.tags.length > 0 && (
                        <div className="flex items-center space-x-1 overflow-hidden">
                          {session.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[10px] text-slate-400 font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeColor}`}
                    >
                      {session.type}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                    {session.date || 'Sep 24'}
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-blue-700 font-bold">
                    {session.startTime} – {session.endTime}
                  </td>

                  {/* Speaker */}
                  <td className="py-3.5 px-3 max-w-[180px]">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center shrink-0">
                        {speakerName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800 truncate" title={speakerName}>
                        {speakerName}
                      </span>
                    </div>
                  </td>

                  {/* Room */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{session.room || session.roomName || 'Main Hall'}</span>
                    </span>
                  </td>

                  {/* Capacity */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-slate-800">
                        {session.capacity || 500} seats
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {percent}% expected
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <SessionStatusBadge status={session.status} size="xs" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => onView(session)}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50/60 rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(session)}
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

export default SessionList;
