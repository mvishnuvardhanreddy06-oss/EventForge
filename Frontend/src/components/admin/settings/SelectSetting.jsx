import React from 'react';

const SelectSetting = ({
  id,
  label,
  description,
  value,
  onChange,
  options = [],
  disabled = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3 first:pt-0 last:pb-0">
      <div className="space-y-0.5 max-w-md">
        <label
          htmlFor={id}
          className="text-xs font-bold text-slate-900 block"
        >
          {label}
        </label>
        {description && (
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer shrink-0 min-w-[180px]"
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectSetting;
