import React from 'react';
import { Search, X } from 'lucide-react';

const StaffSearch = ({ value, onChange, onClear }) => {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email, phone or role..."
        className="block w-full pl-9 pr-8 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl placeholder-slate-400 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          title="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default StaffSearch;
