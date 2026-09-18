import React from 'react';
import { X, ShieldCheck, Hash, Monitor, Globe, Clock, User, Building, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionBadge from './ActionBadge';
import ActivityTimeline from './ActivityTimeline';

const AuditDetailsDrawer = ({ isOpen, onClose, log }) => {
  if (!isOpen || !log) return null;

  const isPlatformAdmin = log.user.role === 'Platform Admin';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center space-x-1.5 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise Audit Record</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Audit Event Details
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Event ID Badge */}
            <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Event ID
                </span>
                <span className="font-mono font-bold text-xs text-blue-950 mt-0.5 block">
                  {log.eventId || log.hash || `AUD-${log.id}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ActionBadge action={log.action} />
                <StatusBadge status={log.status} />
              </div>
            </div>

            {/* Date & Time and Details */}
            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900">{log.date} · {log.time}</span>
              </div>
              <div className="border-t border-slate-200/50 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Description
                </span>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {log.details}
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>User Information</span>
              </span>
              <div className="flex items-center space-x-3 pt-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                    isPlatformAdmin
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600/20'
                      : 'bg-slate-800 text-white'
                  }`}
                >
                  {log.user.avatar || log.user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {log.user.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isPlatformAdmin
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {log.user.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 truncate block mt-0.5">
                    {log.user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Resource & Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-xl border border-slate-200/80 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Resource
                </span>
                <span className="font-bold text-slate-900 block truncate">
                  {log.resource}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block mt-0.5 truncate">
                  ID: {log.resourceId || 'N/A'}
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  IP Address
                </span>
                <span className="font-mono font-bold text-slate-900 block truncate">
                  {log.ipAddress}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Static Enterprise VPN
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Device
                </span>
                <span className="font-semibold text-slate-800 block truncate">
                  {log.device || 'Windows Desktop'}
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Browser
                </span>
                <span className="font-semibold text-slate-800 block truncate">
                  {log.browser || 'Chrome'}
                </span>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4">
              <ActivityTimeline timeline={log.timeline} status={log.status} />
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/60">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsDrawer;
