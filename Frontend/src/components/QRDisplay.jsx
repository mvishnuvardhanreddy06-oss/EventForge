import React from 'react';
import { QrCode, Calendar, MapPin, CheckCircle, Shield } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const QRDisplay = ({ registration, event }) => {
  if (!registration) return null;

  const eventTitle = registration.eventId?.title || event?.title || 'Event Badge';
  const dateStr = registration.eventId?.startDate || event?.startDate;

  return (
    <div className="bg-gradient-to-b from-blue-600 to-indigo-900 p-1 rounded-3xl shadow-xl max-w-sm mx-auto text-white">
      <div className="bg-slate-900 rounded-[22px] p-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-4 uppercase tracking-wider">
          <span>EventForge Pass</span>
          <Shield className="w-4 h-4" />
        </div>

        <h3 className="text-base font-black text-white leading-tight mb-1">
          {eventTitle}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {dateStr ? formatDate(dateStr) : 'Official Corporate Delegate Pass'}
        </p>

        {/* QR Code Frame */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-4">
          {registration.qrCodeUrl ? (
            <img
              src={registration.qrCodeUrl}
              alt="Ticket QR"
              className="w-44 h-44 object-contain mx-auto"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400">
              <QrCode className="w-12 h-12 animate-pulse" />
            </div>
          )}
        </div>

        <p className="font-mono text-xs font-bold text-blue-400 tracking-widest uppercase mb-4">
          {registration.registrationNumber}
        </p>

        {/* Attendee Info */}
        <div className="pt-4 border-t border-slate-800 text-left flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">{registration.attendeeId?.name || 'Attendee Delegate'}</p>
            <p className="text-[10px] text-slate-400">Tier: {registration.ticketId?.name || 'Conference Pass'}</p>
          </div>
          {registration.checkedIn ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-3 h-3 mr-1" /> Checked In
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Valid Badge
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRDisplay;
