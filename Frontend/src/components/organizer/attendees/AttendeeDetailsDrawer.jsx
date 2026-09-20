import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Ticket,
  CreditCard,
  QrCode,
  RotateCcw,
  Edit2,
  Ban,
  Building,
  MapPin,
  Utensils,
  Accessibility,
  FileText,
  Clock
} from 'lucide-react';
import RegistrationStatusBadge from './RegistrationStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import CheckInStatusBadge from './CheckInStatusBadge';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const AttendeeDetailsDrawer = ({
  isOpen,
  onClose,
  attendee,
  onEdit,
  onCheckIn,
  onUndoCheckIn,
  onChangeTicket,
  onCancelRegistration,
  onApprove,
  onReject
}) => {
  if (!isOpen || !attendee) return null;

  const initials = `${attendee.firstName?.[0] || ''}${attendee.lastName?.[0] || ''}`.toUpperCase() || 'AT';
  const formattedPhone = formatIndianPhone(attendee.phone);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-3.5 min-w-0">
                {attendee.profileImage ? (
                  <img
                    src={attendee.profileImage}
                    alt={`${attendee.firstName} ${attendee.lastName}`}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-base font-black text-slate-900 tracking-tight truncate">
                    {attendee.firstName} {attendee.lastName}
                  </h2>
                  <p className="text-xs text-slate-600 font-semibold truncate mt-0.5">
                    {attendee.designation || 'Attendee'}
                    {attendee.company && <span> · {attendee.company}</span>}
                  </p>
                  <div className="mt-1.5 flex items-center space-x-2">
                    <RegistrationStatusBadge
                      status={attendee.registrationStatus}
                      queuePosition={attendee.waitlistPosition}
                    />
                    {attendee.checkedIn && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ● Checked In
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
            {/* Quick Pending Approval Alert */}
            {attendee.registrationStatus === 'pending' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-amber-900 text-xs">Registration Awaiting Approval</h4>
                  <p className="text-[11px] text-amber-700">
                    Review attendee credentials and approve or reject their access.
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onReject?.(attendee)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold hover:bg-rose-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onApprove?.(attendee)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}

            {/* CONTACT SECTION */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Contact Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <a href={`mailto:${attendee.email}`} className="font-semibold text-blue-600 hover:underline text-xs truncate block mt-0.5">
                    {attendee.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Indian Mobile (+91)</span>
                  <p className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                    {formattedPhone || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* EVENT SECTION */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Event & Registration Details
                </h4>
              </div>

              <div className="space-y-2.5 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Event</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">
                    {attendee.eventTitle || 'Global Tech Leadership Summit 2026'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Registration ID</span>
                    <p className="font-mono font-bold text-blue-600 text-xs mt-0.5">
                      {attendee.registrationId || 'REG-2026-002481'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered On</span>
                    <p className="font-semibold text-slate-800 text-xs mt-0.5">
                      {attendee.registeredAtFormatted || attendee.registeredAt || 'Sep 12, 2026'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TICKET & PAYMENT SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ticket Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Ticket className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Ticket Pass
                  </h4>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ticket Tier</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mt-0.5">
                      {attendee.ticketType || 'Standard'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ticket ID</span>
                    <p className="font-mono font-semibold text-slate-700 text-xs">
                      {attendee.ticketId || 'EVF-VIP-002481'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Standard Price</span>
                    <p className="font-mono font-bold text-slate-900 text-xs">
                      ₹{typeof attendee.amountPaid === 'number' ? attendee.amountPaid.toLocaleString('en-IN') : '4,999'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Payment Status
                  </h4>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                    <div className="mt-0.5">
                      <PaymentStatusBadge status={attendee.paymentStatus} showAmount={false} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Amount Settled</span>
                    <p className="font-mono font-bold text-slate-900 text-xs">
                      ₹{typeof attendee.amountPaid === 'number' ? attendee.amountPaid.toLocaleString('en-IN') : '4,999'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CHECK-IN SECTION */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Onsite Check-In Status
                  </h4>
                </div>

                {attendee.checkedIn ? (
                  <button
                    type="button"
                    onClick={() => onUndoCheckIn?.(attendee)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo Check-In</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCheckIn?.(attendee)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Check In Now</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendance</span>
                  <div className="mt-0.5">
                    <CheckInStatusBadge
                      checkedIn={attendee.checkedIn}
                      checkInTime={attendee.checkInTime}
                      checkInDate={attendee.checkInDate}
                      showTime={false}
                    />
                  </div>
                </div>
                {attendee.checkedIn && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Scan Timestamp</span>
                    <p className="font-semibold text-slate-900 text-xs mt-0.5">
                      {attendee.checkInTime || '08:42 AM'} · {attendee.checkInDate || 'Sep 24, 2026'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      By: {attendee.checkedInBy || 'Gate Staff 1'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* OPTIONAL PROFILE & PREFERENCES */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <User className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Profile & Attendee Preferences
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">City & Location</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    {attendee.city ? `${attendee.city}, ${attendee.country || 'India'}` : 'Bengaluru, India'}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dietary Preference</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center space-x-1">
                    <Utensils className="w-3 h-3 text-slate-400" />
                    <span>{attendee.dietaryPreference || 'Standard / None'}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Accessibility Requirements</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center space-x-1">
                    <Accessibility className="w-3 h-3 text-slate-400" />
                    <span>{attendee.accessibilityRequirements || 'None reported'}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Interests</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">
                    {attendee.interests || 'Cloud Architecture, AI/ML, DevOps'}
                  </p>
                </div>
              </div>

              {attendee.notes && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Organizer Notes</span>
                  <p className="text-xs text-slate-600 italic mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    {attendee.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>

              {attendee.registrationStatus !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCancelRegistration?.(attendee);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center space-x-1"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cancel Registration</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onChangeTicket?.(attendee);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center space-x-1"
              >
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                <span>Change Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit?.(attendee);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Attendee</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDetailsDrawer;
