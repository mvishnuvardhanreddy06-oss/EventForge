import React from 'react';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';
import {
  X,
  Mail,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  Activity,
  Key,
  CheckCircle2,
  Lock
} from 'lucide-react';

const UserDetailsDrawer = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onSuspend,
  onActivate
}) => {
  if (!isOpen || !user) return null;

  const isAdmin = user.role === 'admin';
  const initials = isAdmin || (user.name && user.name.toLowerCase().includes('vishnu')) ? 'VR' : user.name ? user.name.slice(0, 2).toUpperCase() : 'EF';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-text">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200/80 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Platform Account Record
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                User Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Profile Highlight Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-md">
                {initials}
              </div>
              <h4 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1.5">
                <span>{user.name}</span>
                {isAdmin && <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />}
              </h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {user.email}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>

            {/* Organization Scope */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Organization & Tenancy
              </span>
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {isAdmin ? 'EventForge Platform' : user.organization || 'Nexus Tech Summits'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {isAdmin ? 'Global Multi-Tenant Authority' : 'Assigned Organization'}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account Information
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Joined</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {user.joined || 'Aug 01, 2026'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Last Active</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {user.lastActive || 'Today, 10:42 AM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Activity Telemetry */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account Activity Telemetry
              </span>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2.5 text-xs text-slate-700">
                {isAdmin ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Events Governed:</span>
                      <span className="font-bold text-slate-900">24 Multi-Tenant Events</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Platform Accounts:</span>
                      <span className="font-bold text-slate-900">56 Registered Users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">System Health SLA:</span>
                      <span className="font-bold text-emerald-600">99.98% Operational</span>
                    </div>
                  </>
                ) : user.role === 'organizer' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Conferences Hosted:</span>
                      <span className="font-bold text-slate-900">4 Active Summits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Keynote Sessions:</span>
                      <span className="font-bold text-slate-900">18 Confirmed Sessions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Delegates Checked-In:</span>
                      <span className="font-bold text-slate-900">1,420 Attendees</span>
                    </div>
                  </>
                ) : user.role === 'staff' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">QR Badges Scanned:</span>
                      <span className="font-bold text-slate-900">348 Check-ins</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Assigned Venue:</span>
                      <span className="font-bold text-slate-900">Moscone Center (Hall A)</span>
                    </div>
                  </>
                ) : user.role === 'speaker' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Sessions Assigned:</span>
                      <span className="font-bold text-slate-900">3 Keynote Sessions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Average Rating:</span>
                      <span className="font-bold text-indigo-600">4.92 / 5.0 Rating</span>
                    </div>
                  </>
                ) : user.role === 'sponsor' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Sponsorship Tier:</span>
                      <span className="font-bold text-amber-600">Diamond Tier Partner</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Deliverables Uploaded:</span>
                      <span className="font-bold text-slate-900">12 of 12 Approved</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Events Registered:</span>
                      <span className="font-bold text-slate-900">2 Conferences</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Digital Badge QR:</span>
                      <span className="font-bold text-emerald-600">Active (EF-VIP-9941)</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Security Profile */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>2FA Status</span>
              </span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Enforced &amp; Verified
              </span>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onEdit(user)}
              className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors text-center"
            >
              {isAdmin ? 'Edit Profile' : 'Edit User'}
            </button>

            {!isAdmin && (
              user.status === 'suspended' ? (
                <button
                  type="button"
                  onClick={() => onActivate(user)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
                >
                  Activate User
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSuspend(user)}
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
                >
                  Suspend User
                </button>
              )
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors text-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsDrawer;
