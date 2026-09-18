import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const AnalyticsFilterBar = ({
  orgFilter,
  onOrgFilterChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  planFilter,
  onPlanFilterChange,
  roleFilter,
  onRoleFilterChange,
  onClearFilters
}) => {
  const isFiltered = Boolean(
    orgFilter !== 'All' ||
    eventTypeFilter !== 'All' ||
    planFilter !== 'All' ||
    roleFilter !== 'All'
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-900 tracking-tight">Data Filter Dimensions</span>
        </div>

        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Organization */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</label>
          <select
            value={orgFilter}
            onChange={(e) => onOrgFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Organizations</option>
            <option value="Apex Global Events">Apex Global Events</option>
            <option value="Nexus Tech Summits">Nexus Tech Summits</option>
            <option value="TechCorp Solutions">TechCorp Solutions</option>
            <option value="CloudScale Dynamics">CloudScale Dynamics</option>
          </select>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Event Type</label>
          <select
            value={eventTypeFilter}
            onChange={(e) => onEventTypeFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Event Types</option>
            <option value="Conferences">Corporate Conferences</option>
            <option value="Tech Summits">Tech Summits</option>
            <option value="Exhibitions">Industry Exhibitions</option>
            <option value="Workshops">Workshops & Seminars</option>
          </select>
        </div>

        {/* Subscription Plan */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subscription Plan</label>
          <select
            value={planFilter}
            onChange={(e) => onPlanFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Plans</option>
            <option value="Free">Free ($0/mo)</option>
            <option value="Pro">Pro ($49/mo)</option>
            <option value="Enterprise">Enterprise ($199/mo)</option>
          </select>
        </div>

        {/* User Role */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target User Role</label>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All User Roles</option>
            <option value="Attendee">Attendees</option>
            <option value="Sponsor">Sponsors</option>
            <option value="Speaker">Speakers</option>
            <option value="Staff">Staff</option>
            <option value="Organizer">Organizers</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilterBar;
