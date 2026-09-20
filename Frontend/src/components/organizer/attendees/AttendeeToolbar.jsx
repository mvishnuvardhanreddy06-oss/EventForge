import React from 'react';
import { Search, RotateCcw, Filter, LayoutGrid, List } from 'lucide-react';

const REGISTRATION_OPTIONS = [
  { value: 'all', label: 'All Registrations' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'waitlisted', label: 'Waitlisted' }
];

const TICKET_OPTIONS = [
  { value: 'all', label: 'All Ticket Types' },
  { value: 'Standard', label: 'Standard' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Early Bird', label: 'Early Bird' },
  { value: 'Student', label: 'Student' },
  { value: 'Corporate', label: 'Corporate' }
];

const PAYMENT_OPTIONS = [
  { value: 'all', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'refunded', label: 'Refunded' }
];

const CHECKIN_OPTIONS = [
  { value: 'all', label: 'All Check-in' },
  { value: 'not_checked_in', label: 'Not Checked In' },
  { value: 'checked_in', label: 'Checked In' }
];

const DATE_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' }
];

const AttendeeToolbar = ({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  events = [],
  viewMode = 'table',
  onViewModeChange,
  totalMatches = 0
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filters.registrationStatus !== 'all' ||
    filters.ticketType !== 'all' ||
    filters.paymentStatus !== 'all' ||
    filters.checkInStatus !== 'all' ||
    filters.eventId !== 'all' ||
    filters.dateRegistered !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
      {/* Top Search and View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, phone or ticket ID..."
            className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Table</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Cards</span>
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs pt-1">
        {/* Registration Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Registration</label>
          <select
            value={filters.registrationStatus}
            onChange={(e) => onFilterChange('registrationStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          >
            {REGISTRATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ticket Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ticket Type</label>
          <select
            value={filters.ticketType}
            onChange={(e) => onFilterChange('ticketType', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          >
            {TICKET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          >
            {PAYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Check-in</label>
          <select
            value={filters.checkInStatus}
            onChange={(e) => onFilterChange('checkInStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          >
            {CHECKIN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Event Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Event</label>
          <select
            value={filters.eventId}
            onChange={(e) => onFilterChange('eventId', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none text-xs truncate"
          >
            <option value="all">All Events</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>

        {/* Date Registered */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date Registered</label>
          <select
            value={filters.dateRegistered}
            onChange={(e) => onFilterChange('dateRegistered', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AttendeeToolbar;
