import React from 'react';
import { Search, X, LayoutGrid, List, Filter, ChevronDown, RotateCcw } from 'lucide-react';

const EventToolbar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  eventType,
  onEventTypeChange,
  dateFilter,
  onDateFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalCount
}) => {
  const isFiltered = search || (status && status !== 'all') || (eventType && eventType !== 'all') || (dateFilter && dateFilter !== 'all');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by event name, venue, organizer..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Switcher & Sort */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5 shrink-0">
          {/* Sort Selector */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-medium">
            <span className="hidden sm:inline text-slate-400 text-[11px] font-semibold">Sort:</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="registrations">Sort: Most Registrations</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
          </div>

          {/* Grid / List Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              title="List View"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-1 text-slate-400 font-bold text-[10px] uppercase tracking-wider pr-1">
          <Filter className="w-3 h-3 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none transition-colors cursor-pointer ${
            status && status !== 'all'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="all">Status: All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Event Type Filter */}
        <select
          value={eventType}
          onChange={(e) => onEventTypeChange(e.target.value)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none transition-colors cursor-pointer ${
            eventType && eventType !== 'all'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="all">Event Type: All Types</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
          <option value="Exhibition">Exhibition</option>
          <option value="Corporate Meeting">Corporate Meeting</option>
          <option value="Networking">Networking</option>
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none transition-colors cursor-pointer ${
            dateFilter && dateFilter !== 'all'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <option value="all">Date: All Dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="past">Past Events</option>
        </select>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold transition-colors ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}

        {/* Matching items count tag */}
        <span className="text-[11px] font-semibold text-slate-400 ml-auto hidden md:inline">
          Showing <strong>{totalCount}</strong> event{totalCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  );
};

export default EventToolbar;
