import React from 'react';
import { RotateCcw, Filter, ChevronDown } from 'lucide-react';
import { STAFF_ROLES } from '../../../services/staffService';

const StaffFilters = ({
  filters,
  events = [],
  onFilterChange,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Role Filter */}
      <div className="relative min-w-[130px]">
        <select
          value={filters.role || 'all'}
          onChange={(e) => onFilterChange('role', e.target.value)}
          className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border shadow-2xs appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
            filters.role && filters.role !== 'all'
              ? 'bg-blue-50/70 border-blue-300 text-blue-900'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="all">All Roles</option>
          {STAFF_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Status Filter */}
      <div className="relative min-w-[100px]">
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border shadow-2xs appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
            filters.status && filters.status !== 'all'
              ? 'bg-blue-50/70 border-blue-300 text-blue-900'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Invited">Invited</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Assignment Filter */}
      <div className="relative min-w-[120px]">
        <select
          value={filters.assignment || 'all'}
          onChange={(e) => onFilterChange('assignment', e.target.value)}
          className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border shadow-2xs appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
            filters.assignment && filters.assignment !== 'all'
              ? 'bg-blue-50/70 border-blue-300 text-blue-900'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="all">All Assignments</option>
          <option value="Assigned">Assigned</option>
          <option value="Unassigned">Unassigned</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Shift Filter */}
      <div className="relative min-w-[110px]">
        <select
          value={filters.shift || 'all'}
          onChange={(e) => onFilterChange('shift', e.target.value)}
          className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border shadow-2xs appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
            filters.shift && filters.shift !== 'all'
              ? 'bg-blue-50/70 border-blue-300 text-blue-900'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="all">All Shifts</option>
          <option value="Today">Today</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Event Filter (inside filter bar as well) */}
      <div className="relative min-w-[130px] hidden md:block">
        <select
          value={filters.eventId || 'all'}
          onChange={(e) => onFilterChange('eventId', e.target.value)}
          className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border shadow-2xs appearance-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
            filters.eventId && filters.eventId !== 'all'
              ? 'bg-blue-50/70 border-blue-300 text-blue-900'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <option value="all">All Events</option>
          {events.map((evt) => (
            <option key={evt._id} value={evt._id}>
              {evt.title}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
};

export default StaffFilters;
