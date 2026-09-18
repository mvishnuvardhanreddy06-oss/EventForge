import React from 'react';
import { Search, X } from 'lucide-react';

const FilterBar = ({
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanFilterChange,
  statusFilter,
  onStatusFilterChange,
  renewalFilter,
  onRenewalFilterChange,
  plans,
  totalCount,
  filteredCount,
  onReset
}) => {
  const isFiltered = Boolean(searchQuery || planFilter !== 'All' || statusFilter !== 'All' || renewalFilter !== 'All');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search organizations or emails..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Plan Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Plan:</span>
            <select
              value={planFilter}
              onChange={(e) => onPlanFilterChange(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Plans</option>
              {plans.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Renewal Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">Renewal:</span>
            <select
              value={renewalFilter}
              onChange={(e) => onRenewalFilterChange(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="This Month">This Month</option>
              <option value="Next Month">Next Month</option>
              <option value="Later">Later</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Counter bar */}
      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100/80 flex items-center justify-between">
        <span>
          Showing <strong className="text-slate-700 font-semibold">{filteredCount}</strong> of {totalCount} organizations
        </span>
        {isFiltered && (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
            Filters Active
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
