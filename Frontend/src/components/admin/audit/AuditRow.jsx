import React from 'react';
import ActionBadge from './ActionBadge';
import StatusBadge from './StatusBadge';

const AuditRow = ({ log, onView }) => {
  const isPlatformAdmin = log.user.role === 'Platform Admin';

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* 1. Date & Time */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className="font-semibold text-slate-900 text-xs block">
          {log.date}
        </span>
        <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
          {log.time}
        </span>
      </td>

      {/* 2. User (Avatar, Name, Email) */}
      <td className="py-3.5 px-4 min-w-[200px]">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
              isPlatformAdmin
                ? 'bg-blue-600 text-white ring-2 ring-blue-600/20'
                : 'bg-slate-800 text-white'
            }`}
          >
            {log.user.avatar || log.user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 truncate text-xs">
                {log.user.name}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 truncate block mt-0.5">
              {log.user.email}
            </span>
          </div>
        </div>
      </td>

      {/* 3. Action */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <ActionBadge action={log.action} />
      </td>

      {/* 4. Resource */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className="text-xs font-semibold text-slate-800">
          {log.resource}
        </span>
      </td>

      {/* 5. Details */}
      <td className="py-3.5 px-4 min-w-[240px] max-w-sm">
        <p className="text-xs text-slate-700 font-medium truncate" title={log.details}>
          {log.details}
        </p>
      </td>

      {/* 6. IP Address */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className="font-mono text-xs text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-200/60">
          {log.ipAddress}
        </span>
      </td>

      {/* 7. Status */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <StatusBadge status={log.status} />
      </td>

      {/* 8. Actions */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={() => onView(log)}
          className="inline-flex items-center justify-center px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
        >
          View
        </button>
      </td>
    </tr>
  );
};

export default AuditRow;
