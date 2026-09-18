import React from 'react';
import AuditRow from './AuditRow';
import EmptyState from './EmptyState';
import ActionBadge from './ActionBadge';
import StatusBadge from './StatusBadge';

const AuditTable = ({ logs, onViewDetails, onClearFilters }) => {
  if (logs.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Resource</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90 text-xs text-slate-700">
            {logs.map((log) => (
              <AuditRow key={log.id} log={log} onView={onViewDetails} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (Strictly 0 Horizontal Overflow) */}
      <div className="md:hidden divide-y divide-slate-100">
        {logs.map((log) => {
          const isPlatformAdmin = log.user.role === 'Platform Admin';
          return (
            <div key={log.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
              {/* Header: User & Timestamp */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      isPlatformAdmin
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {log.user.avatar || log.user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {log.user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {log.user.email}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-semibold text-slate-900 block">
                    {log.date.split(',')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {log.time}
                  </span>
                </div>
              </div>

              {/* Action & Resource Badges */}
              <div className="flex items-center gap-2 pt-0.5">
                <ActionBadge action={log.action} />
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                  {log.resource}
                </span>
              </div>

              {/* Details text */}
              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60">
                {log.details}
              </p>

              {/* Status & IP */}
              <div className="flex items-center justify-between text-xs pt-1">
                <StatusBadge status={log.status} />
                <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                  {log.ipAddress}
                </span>
              </div>

              {/* View Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onViewDetails(log)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors flex items-center justify-center cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditTable;
