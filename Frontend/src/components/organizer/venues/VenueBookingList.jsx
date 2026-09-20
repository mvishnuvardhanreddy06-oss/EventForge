import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VenueBookingList = ({ bookings = [], venueName, onViewEvent }) => {
  const navigate = useNavigate();

  const handleNavigateEvent = (booking) => {
    if (onViewEvent) {
      onViewEvent(booking);
    } else {
      navigate('/organizer/events');
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
        <Calendar className="w-5 h-5 text-slate-400 mx-auto" />
        <p className="text-xs font-bold text-slate-700">No Upcoming Bookings</p>
        <p className="text-[11px] text-slate-400">
          This venue currently has no scheduled corporate events assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Upcoming Bookings ({bookings.length})</span>
        </h4>
        <span className="text-[10px] font-semibold text-slate-400">
          Confirmed Schedules
        </span>
      </div>

      <div className="space-y-2.5">
        {bookings.map((booking, index) => (
          <div
            key={booking.id || index}
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="font-bold text-slate-900 text-xs leading-snug">
                  {booking.title}
                </h5>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                  {booking.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleNavigateEvent(booking)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0"
              >
                <span>View Event</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="font-medium text-slate-700">{booking.room || 'Main Hall'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueBookingList;
