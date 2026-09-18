import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

const UserFilterBar = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  orgFilter,
  onOrgFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalFiltered,
  totalCount
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="All">All Roles</option>
            <option value="admin">Platform Admin</option>
            <option value="organizer">Organizer</option>
            <option value="staff">Staff</option>
            <option value="speaker">Speaker</option>
            <option value="sponsor">Sponsor</option>
            <option value="attendee">Attendee</option>
          </select>

          {/* Organization Filter */}
          <select
            value={orgFilter}
            onChange={(e) => onOrgFilterChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="All">All Organizations</option>
            <option value="EventForge Platform">EventForge Platform</option>
            <option value="TechCorp Global">TechCorp Global</option>
            <option value="Nexus Conferences">Nexus Conferences</option>
            <option value="Apex Innovations">Apex Innovations</option>
            <option value="Global Summit Co">Global Summit Co</option>
            <option value="Horizon Media">Horizon Media</option>
            <option value="InnovateX">InnovateX</option>
            <option value="FutureTech">FutureTech</option>
            <option value="CloudScale Dynamics">CloudScale Dynamics</option>
            <option value="Apex Global Events">Apex Global Events</option>
            <option value="Nexus Tech Summits">Nexus Tech Summits</option>
            <option value="TechWorld Solutions">TechWorld Solutions</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Date Joined Filter */}
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 cursor-pointer transition-all"
          >
            <option value="All">All Dates</option>
            <option value="this_month">This Month (Sep 2026)</option>
            <option value="last_month">Last Month (Aug 2026)</option>
            <option value="earlier">Earlier</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter summary status */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Showing <strong className="text-slate-900 font-semibold">{totalFiltered}</strong> of{' '}
          <strong className="text-slate-900 font-semibold">{totalCount}</strong> platform users
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Active Filters Applied
          </span>
        )}
      </div>
    </div>
  );
};

export default UserFilterBar;
