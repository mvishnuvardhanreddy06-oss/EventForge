import React, { useState } from 'react';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import SessionStatusBadge from './SessionStatusBadge';

const HOURS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
];

const ROOM_COLUMNS = ['Main Hall', 'Hall A', 'Hall B', 'Room 101'];

const CalendarView = ({ sessions = [], onViewSession }) => {
  const [calendarMode, setCalendarMode] = useState('day'); // 'day' | 'week'
  const [currentDate, setCurrentDate] = useState('Sep 24, 2026');

  // Convert 12h time string ("10:00 AM") to hour integer (10)
  const parseHour = (timeStr) => {
    if (!timeStr) return 9;
    const parts = timeStr.split(':');
    let hour = parseInt(parts[0], 10);
    const isPM = timeStr.toLowerCase().includes('pm');
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-4">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-black text-slate-900">{currentDate}</span>
          <span className="text-xs text-slate-400">· Schedule Grid</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Day / Week Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCalendarMode('day')}
              className={`px-3 py-1 rounded-lg transition-all ${
                calendarMode === 'day'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setCalendarMode('week')}
              className={`px-3 py-1 rounded-lg transition-all ${
                calendarMode === 'week'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Room Columns Header */}
          <div className="grid grid-cols-5 gap-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-16 text-center text-slate-400">Time</div>
            {ROOM_COLUMNS.map((room) => (
              <div key={room} className="text-center bg-slate-50 py-1.5 rounded-xl text-slate-800 font-extrabold border border-slate-100">
                {room}
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-slate-100">
            {HOURS.map((hourStr) => {
              const hourNum = parseInt(hourStr.split(':')[0], 10);
              const displayHour = hourNum > 12 ? `${hourNum - 12}:00 PM` : `${hourNum}:00 AM`;

              return (
                <div key={hourStr} className="grid grid-cols-5 gap-2 py-2.5 min-h-[90px] items-stretch">
                  {/* Time Label */}
                  <div className="w-16 text-center text-[11px] font-bold text-slate-400 pt-1 shrink-0">
                    {displayHour}
                  </div>

                  {/* Rooms Columns */}
                  {ROOM_COLUMNS.map((room) => {
                    const matchingSessions = sessions.filter((s) => {
                      const sHour = parseHour(s.startTime);
                      const sRoom = s.room || s.roomName || 'Main Hall';
                      return sHour === hourNum && (sRoom.toLowerCase().includes(room.toLowerCase()) || room.toLowerCase().includes(sRoom.toLowerCase()));
                    });

                    return (
                      <div
                        key={room}
                        className="rounded-xl border border-slate-100/80 bg-slate-50/40 p-1.5 flex flex-col justify-start relative hover:bg-slate-50 transition-colors"
                      >
                        {matchingSessions.map((session) => (
                          <div
                            key={session.id || session._id}
                            onClick={() => onViewSession(session)}
                            className="w-full p-2 rounded-xl bg-white border border-blue-200/90 shadow-2xs hover:shadow-xs hover:border-blue-400 cursor-pointer transition-all space-y-1 mb-1"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-blue-600 truncate">
                                {session.startTime}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-md font-bold bg-blue-50 text-blue-700 text-[9px]">
                                {session.type}
                              </span>
                            </div>

                            <p className="text-xs font-black text-slate-900 leading-snug line-clamp-2">
                              {session.title}
                            </p>

                            <p className="text-[10px] text-slate-500 truncate flex items-center space-x-1">
                              <User className="w-2.5 h-2.5 text-slate-400" />
                              <span>{session.speaker?.name || session.speakerName || 'Speaker'}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
