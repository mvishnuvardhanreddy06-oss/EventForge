import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle2, AlertTriangle, CalendarCheck } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const VenueAvailabilityCalendar = ({ venue, onDateSelect }) => {
  // Default to September 2026 based on the prompt's corporate event schedule
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [selectedDay, setSelectedDay] = useState(24);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 8, 1));
    setSelectedDay(24);
  };

  // Generate date schedule map for current month and year
  const getDayStatus = (day) => {
    // If venue is inactive
    if (venue.status === 'inactive') {
      return { status: 'inactive', label: 'Venue Inactive' };
    }

    // Check specific mock bookings for September 2026
    if (year === 2026 && month === 8) { // September 2026
      if (day === 24) {
        return {
          status: 'booked',
          label: 'Booked',
          event: venue.currentEvent?.title || 'Global Tech Leadership Summit',
          time: '09:00 AM – 06:00 PM',
          room: 'Main Plenary Hall'
        };
      }
      if (day === 27) {
        return {
          status: 'maintenance',
          label: 'Maintenance',
          note: 'Scheduled AV & HVAC Retrofit'
        };
      }
      if (day === 4 && venue.status === 'booked') {
        return {
          status: 'booked',
          label: 'Booked',
          event: 'AI & Cloud Innovation Conference',
          time: '10:00 AM – 05:30 PM',
          room: 'Hall A'
        };
      }
      if (day === 18 && venue.type === 'Outdoor') {
        return {
          status: 'booked',
          label: 'Booked',
          event: 'Annual Cultural TechFest 2026',
          time: '04:00 PM – 10:00 PM',
          room: 'Amphitheatre Stage'
        };
      }
    }

    // Check October 2026
    if (year === 2026 && month === 9) {
      if (day === 4) {
        return {
          status: 'booked',
          label: 'Booked',
          event: 'AI & Cloud Innovation Conference',
          time: '09:00 AM – 05:00 PM',
          room: 'Conference Hall A'
        };
      }
    }

    // If venue as a whole is set to maintenance
    if (venue.status === 'maintenance') {
      return { status: 'maintenance', label: 'Facility Maintenance', note: 'All halls undergoing scheduled maintenance' };
    }

    return { status: 'available', label: 'Available' };
  };

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedDayInfo = getDayStatus(selectedDay);

  return (
    <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 space-y-4">
      {/* Calendar Navigation Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">
            {MONTH_NAMES[month]} {year}
          </h4>
          <p className="text-[11px] text-slate-400">
            Live hall availability & scheduling slots
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS_OF_WEEK.map((d) => (
          <span key={d} className="text-[10px] font-bold text-slate-400 uppercase py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8 rounded-lg bg-transparent" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayInfo = getDayStatus(day);
          const isSelected = selectedDay === day;

          let statusClass = 'bg-emerald-50/50 text-emerald-800 border-emerald-200/50 hover:bg-emerald-100/60';
          let dotClass = 'bg-emerald-500';

          if (dayInfo.status === 'booked') {
            statusClass = 'bg-blue-100 text-blue-900 border-blue-300 font-bold hover:bg-blue-200';
            dotClass = 'bg-blue-600';
          } else if (dayInfo.status === 'maintenance') {
            statusClass = 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200';
            dotClass = 'bg-amber-600';
          } else if (dayInfo.status === 'inactive') {
            statusClass = 'bg-slate-100 text-slate-400 border-slate-200';
            dotClass = 'bg-slate-400';
          }

          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                onDateSelect?.({ day, month: MONTH_NAMES[month], year, ...dayInfo });
              }}
              className={`relative h-9 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${statusClass} ${
                isSelected ? 'ring-2 ring-blue-600 ring-offset-1 z-10 scale-105' : ''
              }`}
            >
              <span>{day}</span>
              <span className={`w-1 h-1 rounded-full ${dotClass} -mt-0.5`} />
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] pt-2 border-t border-slate-200/80 gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Available</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-600">Booked</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-600">Maintenance</span>
          </span>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            {MONTH_NAMES[month]} {selectedDay}, {year}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              selectedDayInfo.status === 'booked'
                ? 'bg-blue-100 text-blue-700'
                : selectedDayInfo.status === 'maintenance'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {selectedDayInfo.label}
          </span>
        </div>

        {selectedDayInfo.status === 'booked' ? (
          <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
            <p className="font-bold text-slate-900">{selectedDayInfo.event}</p>
            <div className="flex items-center space-x-3 text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{selectedDayInfo.time}</span>
              </span>
              <span>•</span>
              <span>{selectedDayInfo.room}</span>
            </div>
          </div>
        ) : selectedDayInfo.status === 'maintenance' ? (
          <p className="text-[11px] text-amber-700 pt-1 border-t border-slate-100">
            ⚠ {selectedDayInfo.note || 'Scheduled facility maintenance & checks.'}
          </p>
        ) : (
          <p className="text-[11px] text-emerald-700 pt-1 border-t border-slate-100">
            ✓ Full venue and breakout rooms are currently free for reservation.
          </p>
        )}
      </div>
    </div>
  );
};

export default VenueAvailabilityCalendar;
