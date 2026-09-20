import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Coffee, Utensils, Clock } from 'lucide-react';
import SessionCard from './SessionCard';

const AgendaView = ({
  sessions = [],
  onViewSession,
  onEditSession,
  onDuplicateSession,
  onCancelSession,
  selectedSessionIds = [],
  onToggleSelectSession
}) => {
  const [currentDateString, setCurrentDateString] = useState('September 24, 2026');

  // Group sessions by hour slots (e.g. 09:00 AM, 10:00 AM, etc.)
  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  const getSessionsForSlot = (slotTime) => {
    const slotHour = slotTime.split(':')[0]; // e.g. "09" or "10"
    const slotPeriod = slotTime.split(' ')[1]; // e.g. "AM" or "PM"

    return sessions.filter((s) => {
      if (!s.startTime) return false;
      const sHour = s.startTime.split(':')[0].padStart(2, '0');
      const sPeriod = s.startTime.includes('PM') ? 'PM' : 'AM';
      return sHour === slotHour.padStart(2, '0') && sPeriod === slotPeriod;
    });
  };

  const handlePrevDay = () => {
    setCurrentDateString('September 23, 2026');
  };

  const handleToday = () => {
    setCurrentDateString('September 24, 2026');
  };

  const handleNextDay = () => {
    setCurrentDateString('September 25, 2026');
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              {currentDateString}
            </h3>
            <p className="text-xs text-slate-500">
              Corporate Conference Schedule • Track Agenda Day 1
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handlePrevDay}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Day</span>
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNextDay}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <span>Next Day</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timeSlots.map((slot) => {
          const slotSessions = getSessionsForSlot(slot);

          // Special break slots
          const isMorningCoffee = slot === '11:00 AM';
          const isLunchHour = slot === '01:00 PM';

          return (
            <div key={slot} className="relative group">
              {/* Timeline Marker Dot & Time */}
              <div className="absolute -left-6 sm:-left-10 top-0 flex items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-white border-4 border-blue-600 shadow-2xs ring-4 ring-white" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-900 bg-slate-100/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                    {slot}
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* Morning Coffee Break Node */}
                {isMorningCoffee && (
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center space-x-3 text-xs">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-900">Networking & Refreshments Break</p>
                      <p className="text-[11px] text-amber-700">
                        11:00 AM – 11:30 AM • Main Lobby & Exhibition Hall
                      </p>
                    </div>
                  </div>
                )}

                {/* Sessions in this slot */}
                {slotSessions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slotSessions.map((session) => (
                      <SessionCard
                        key={session.id || session._id}
                        session={session}
                        onView={onViewSession}
                        onEdit={onEditSession}
                        onDuplicate={onDuplicateSession}
                        onCancel={onCancelSession}
                        isSelected={selectedSessionIds.includes(session.id || session._id)}
                        onToggleSelect={onToggleSelectSession}
                      />
                    ))}
                  </div>
                ) : !isMorningCoffee && !isLunchHour ? (
                  <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-400 text-xs">
                    No sessions scheduled for this hour slot
                  </div>
                ) : null}

                {/* Lunch Break Node */}
                {isLunchHour && (
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center space-x-3 text-xs">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900">Executive Networking Luncheon</p>
                      <p className="text-[11px] text-emerald-700">
                        01:00 PM – 02:00 PM • Grand Ballroom Banquet Hall
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaView;
