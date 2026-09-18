import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

const AuditFilterBar = ({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  userFilter,
  onUserFilterChange,
  actionFilter,
  onActionFilterChange,
  resourceFilter,
  onResourceFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  usersList = []
}) => {
  const isFiltered = Boolean(
    searchQuery ||
    dateRange !== 'Last 30 Days' ||
    userFilter !== 'All' ||
    actionFilter !== 'All' ||
    resourceFilter !== 'All' ||
    statusFilter !== 'All'
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs space-y-3">
      {/* Top row: Search input & Quick Clear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search logs by user, action or resource..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-bold px-2 py-1 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
        {/* 1. Date Range */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Custom Range">Custom Range</option>
          </select>
        </div>

        {/* 2. User */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            User
          </label>
          <select
            value={userFilter}
            onChange={(e) => onUserFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Users</option>
            <option value="Vishnureddy">Vishnureddy (Platform Admin)</option>
            {usersList
              .filter((u) => u !== 'Vishnureddy')
              .map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
          </select>
        </div>

        {/* 3. Action */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Action
          </label>
          <select
            value={actionFilter}
            onChange={(e) => onActionFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Actions</option>
            <option value="Created">Created</option>
            <option value="Updated">Updated</option>
            <option value="Deleted">Deleted</option>
            <option value="Login">Login</option>
            <option value="Logout">Logout</option>
            <option value="Suspended">Suspended</option>
            <option value="Activated">Activated</option>
            <option value="Role Changed">Role Changed</option>
            <option value="Subscription Changed">Subscription Changed</option>
            <option value="Settings Changed">Settings Changed</option>
          </select>
        </div>

        {/* 4. Resource */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Resource
          </label>
          <select
            value={resourceFilter}
            onChange={(e) => onResourceFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Resources</option>
            <option value="User">User</option>
            <option value="Organization">Organization</option>
            <option value="Event">Event</option>
            <option value="Subscription">Subscription</option>
            <option value="Settings">Settings</option>
            <option value="Authentication">Authentication</option>
          </select>
        </div>

        {/* 5. Status */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AuditFilterBar;
