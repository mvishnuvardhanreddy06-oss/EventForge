import React, { useState } from 'react';
import {
  MoreVertical,
  CheckCircle2,
  XCircle,
  QrCode,
  RotateCcw,
  Mail,
  Bell,
  Download,
  Ticket,
  Ban,
  Phone,
  Eye,
  Edit2
} from 'lucide-react';
import RegistrationStatusBadge from './RegistrationStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import CheckInStatusBadge from './CheckInStatusBadge';
import { formatIndianPhone } from '../../../utils/phoneUtils';

const AttendeeTable = ({
  attendees = [],
  selectedIds = [],
  onSelectAll,
  onSelectOne,
  onManage,
  onApprove,
  onReject,
  onCheckIn,
  onUndoCheckIn,
  onChangeTicket,
  onCancelRegistration,
  onPromoteWaitlist,
  onBulkAction
}) => {
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  const allSelected = attendees.length > 0 && selectedIds.length === attendees.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < attendees.length;

  return (
    <div className="space-y-3">
      {/* Bulk Actions Banner (when 1 or more attendees selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-blue-900">
              {selectedIds.length} {selectedIds.length === 1 ? 'attendee' : 'attendees'} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => onBulkAction('email')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Send Email</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkAction('notification')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-600" />
              <span>Send Notification</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkAction('export')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Selected</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkAction('changeTicket')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors shadow-2xs"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-600" />
              <span>Change Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkAction('checkIn')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mark Checked In</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkAction('cancel')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              <span>Cancel Registration</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <tr>
                <th className="py-3.5 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3 min-w-[180px]">Attendee</th>
                <th className="py-3.5 px-3 min-w-[150px]">Email</th>
                <th className="py-3.5 px-3 min-w-[130px]">Phone</th>
                <th className="py-3.5 px-3 min-w-[140px] hidden md:table-cell">Event</th>
                <th className="py-3.5 px-3 min-w-[120px]">Ticket</th>
                <th className="py-3.5 px-3 min-w-[110px]">Payment</th>
                <th className="py-3.5 px-3 min-w-[120px]">Registration</th>
                <th className="py-3.5 px-3 min-w-[120px]">Check-in</th>
                <th className="py-3.5 px-3 min-w-[100px] hidden lg:table-cell">Registered On</th>
                <th className="py-3.5 pr-4 pl-2 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {attendees.map((att) => {
                const isSelected = selectedIds.includes(att._id);
                const initials = `${att.firstName?.[0] || ''}${att.lastName?.[0] || ''}`.toUpperCase() || 'AT';
                const formattedPhone = formatIndianPhone(att.phone);
                const isActionMenuOpen = activeActionMenuId === att._id;

                return (
                  <tr
                    key={att._id}
                    className={`transition-colors ${
                      isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-4 pr-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectOne(att._id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* Attendee Name & Avatar */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        {att.profileImage ? (
                          <img
                            src={att.profileImage}
                            alt={`${att.firstName} ${att.lastName}`}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate">
                            {att.firstName} {att.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {att.designation || 'Attendee'}
                            {att.company && <span> · {att.company}</span>}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-3">
                      <span className="text-slate-600 font-semibold truncate block max-w-[180px]" title={att.email}>
                        {att.email}
                      </span>
                    </td>

                    {/* Phone (Indian Format) */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-slate-800 font-bold whitespace-nowrap">
                        {formattedPhone || '—'}
                      </span>
                    </td>

                    {/* Event */}
                    <td className="py-3.5 px-3 hidden md:table-cell">
                      <span className="text-slate-600 font-semibold truncate block max-w-[150px]" title={att.eventTitle}>
                        {att.eventTitle}
                      </span>
                    </td>

                    {/* Ticket */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                          {att.ticketType}
                        </span>
                        <p className="font-mono text-[10px] text-slate-400 font-medium">
                          {att.ticketId}
                        </p>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-3">
                      <PaymentStatusBadge
                        status={att.paymentStatus}
                        amount={att.amountPaid}
                        showAmount={true}
                      />
                    </td>

                    {/* Registration */}
                    <td className="py-3.5 px-3">
                      <RegistrationStatusBadge
                        status={att.registrationStatus}
                        queuePosition={att.waitlistPosition}
                      />
                    </td>

                    {/* Check-in */}
                    <td className="py-3.5 px-3">
                      <CheckInStatusBadge
                        checkedIn={att.checkedIn}
                        checkInTime={att.checkInTime}
                        checkInDate={att.checkInDate}
                      />
                    </td>

                    {/* Registered On */}
                    <td className="py-3.5 px-3 hidden lg:table-cell text-slate-500 text-[11px] whitespace-nowrap">
                      {att.registeredAtFormatted || att.registeredAt || 'Sep 12, 2026'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-4 pl-2 text-right">
                      <div className="inline-flex items-center space-x-1.5 relative">
                        <button
                          type="button"
                          onClick={() => onManage(att)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
                        >
                          Manage
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveActionMenuId(isActionMenuOpen ? null : att._id)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Quick Actions Dropdown */}
                          {isActionMenuOpen && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1 z-30 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveActionMenuId(null);
                                  onManage(att);
                                }}
                                className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                <span>View Details</span>
                              </button>

                              {att.registrationStatus === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionMenuId(null);
                                      onApprove(att);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionMenuId(null);
                                      onReject(att);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center space-x-2"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              {att.registrationStatus === 'waitlisted' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    onPromoteWaitlist(att);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center space-x-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Promote to Confirmed</span>
                                </button>
                              )}

                              {att.registrationStatus === 'confirmed' && !att.checkedIn && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    onCheckIn(att);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Check In</span>
                                </button>
                              )}

                              {att.checkedIn && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    onUndoCheckIn(att);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center space-x-2"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Undo Check-In</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setActiveActionMenuId(null);
                                  onChangeTicket(att);
                                }}
                                className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                              >
                                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                                <span>Change Ticket</span>
                              </button>

                              {att.registrationStatus !== 'cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionMenuId(null);
                                    onCancelRegistration(att);
                                  }}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 border-t border-slate-100"
                                >
                                  <Ban className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Cancel Registration</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendeeTable;
