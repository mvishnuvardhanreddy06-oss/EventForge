import React from 'react';
import { Calendar } from 'lucide-react';

const DATE_RANGES = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 3 Months',
  'Last 6 Months',
  'This Year'
];

const DateRangeSelector = ({ selectedRange, onRangeChange }) => {
  return (
    <div className="relative inline-flex items-center">
      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={selectedRange}
        onChange={(e) => onRangeChange(e.target.value)}
        className="pl-8 pr-7 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs transition-colors cursor-pointer appearance-none"
      >
        {DATE_RANGES.map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">
        ▼
      </div>
    </div>
  );
};

export default DateRangeSelector;
