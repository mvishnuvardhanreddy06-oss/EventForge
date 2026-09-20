import React from 'react';
import { Phone, Mail, Building, Ticket, ArrowRight, MoreVertical } from 'lucide-react';
import RegistrationStatusBadge from './RegistrationStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import CheckInStatusBadge from './CheckInStatusBadge';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const AttendeeCard = ({
  attendee,
  isSelected,
  onSelect,
  onManage,
  onQuickAction
}) => {
  const initials = `${attendee.firstName?.[0] || ''}${attendee.lastName?.[0] || ''}`.toUpperCase() || 'AT';
  const formattedPhone = formatIndianPhone(attendee.phone);

  return (
    <div
      className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3.5 transition-all duration-200 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Header: Avatar, Name, Selection */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(attendee._id)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
          />

          {/* Avatar or Initials */}
          {attendee.profileImage ? (
            <img
              src={attendee.profileImage}
              alt={`${attendee.firstName} ${attendee.lastName}`}
              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-sm font-black text-slate-900 truncate">
              {attendee.firstName} {attendee.lastName}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate">
              {attendee.designation || 'Attendee'}
              {attendee.company && <span> · {attendee.company}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Ticket, Payment & Status Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
          <Ticket className="w-3 h-3 text-blue-600" />
          <span>{attendee.ticketType}</span>
          {attendee.ticketId && <span className="font-mono text-[10px] text-blue-500 font-normal">({attendee.ticketId})</span>}
        </span>

        <RegistrationStatusBadge
          status={attendee.registrationStatus}
          queuePosition={attendee.waitlistPosition}
        />

        <CheckInStatusBadge
          checkedIn={attendee.checkedIn}
          checkInTime={attendee.checkInTime}
          checkInDate={attendee.checkInDate}
        />
      </div>

      {/* Contact & Payment Info */}
      <div className="space-y-1 text-xs text-slate-600 pt-1">
        {formattedPhone && (
          <p className="flex items-center space-x-1.5 font-mono text-slate-800 font-semibold text-xs">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formattedPhone}</span>
          </p>
        )}
        <p className="flex items-center space-x-1.5 text-slate-500 truncate">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{attendee.email}</span>
        </p>
        <div className="pt-1 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Payment:</span>
          <PaymentStatusBadge
            status={attendee.paymentStatus}
            amount={attendee.amountPaid}
            showAmount={true}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono">
          {attendee.registrationId}
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => onManage(attendee)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center space-x-1"
          >
            <span>Manage</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendeeCard;
