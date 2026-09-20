import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

const VenueToolbar = ({
  searchQuery,
  onSearchChange,
  availabilityFilter,
  onAvailabilityChange,
  venueTypeFilter,
  onVenueTypeChange,
  cityFilter,
  onCityChange,
  onClearFilters,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by venue name, city or address..."
            className="w-full pl-9 pr-9 py-2 text-xs text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Availability Filter */}
          <div className="relative">
            <select
              value={availabilityFilter}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 bg-slate-50/70 border border-slate-200 rounded-xl hover:bg-slate-100/60 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Venue Type Filter */}
          <div className="relative">
            <select
              value={venueTypeFilter}
              onChange={(e) => onVenueTypeChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 bg-slate-50/70 border border-slate-200 rounded-xl hover:bg-slate-100/60 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="all">All Venue Types</option>
              <option value="Convention Center">Convention Center</option>
              <option value="Hotel">Hotel</option>
              <option value="Conference Hall">Conference Hall</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Online / Hybrid">Online / Hybrid</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              value={cityFilter}
              onChange={(e) => onCityChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 bg-slate-50/70 border border-slate-200 rounded-xl hover:bg-slate-100/60 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="all">All Cities</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 ml-auto">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result Counter & Active Filter Pills */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Showing <span className="font-bold text-slate-800">{totalResults}</span> {totalResults === 1 ? 'venue' : 'venues'}
        </div>
        {hasActiveFilters && (
          <span className="text-slate-400">
            Filtered results active
          </span>
        )}
      </div>
    </div>
  );
};

export default VenueToolbar;
