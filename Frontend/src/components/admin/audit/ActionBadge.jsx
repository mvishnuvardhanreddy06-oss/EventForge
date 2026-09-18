import React from 'react';
import {
  PlusCircle,
  RefreshCw,
  Trash2,
  LogIn,
  LogOut,
  Power,
  UserCheck,
  CreditCard,
  Settings
} from 'lucide-react';

const ActionBadge = ({ action }) => {
  const act = (action || '').toLowerCase();

  // Created: Green/blue
  if (act.includes('create')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
        <PlusCircle className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Created</span>
      </span>
    );
  }

  // Updated: Blue
  if (act.includes('update')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
        <RefreshCw className="w-3 h-3 text-blue-600 shrink-0" />
        <span>Updated</span>
      </span>
    );
  }

  // Deleted: Red
  if (act.includes('delete')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60 shrink-0">
        <Trash2 className="w-3 h-3 text-rose-600 shrink-0" />
        <span>Deleted</span>
      </span>
    );
  }

  // Login: Purple/blue
  if (act === 'login') {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60 shrink-0">
        <LogIn className="w-3 h-3 text-indigo-600 shrink-0" />
        <span>Login</span>
      </span>
    );
  }

  // Logout: Gray
  if (act === 'logout') {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
        <LogOut className="w-3 h-3 text-slate-500 shrink-0" />
        <span>Logout</span>
      </span>
    );
  }

  // Suspended: Red
  if (act.includes('suspend')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60 shrink-0">
        <Power className="w-3 h-3 text-rose-600 shrink-0" />
        <span>Suspended</span>
      </span>
    );
  }

  // Activated: Green
  if (act.includes('activat')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
        <Power className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Activated</span>
      </span>
    );
  }

  // Role Changed: Amber
  if (act.includes('role')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
        <UserCheck className="w-3 h-3 text-amber-600 shrink-0" />
        <span>Role Changed</span>
      </span>
    );
  }

  // Subscription Changed: Blue
  if (act.includes('subscript')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 shrink-0">
        <CreditCard className="w-3 h-3 text-blue-600 shrink-0" />
        <span>Subscription Changed</span>
      </span>
    );
  }

  // Settings Changed: Gray
  if (act.includes('setting')) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
        <Settings className="w-3 h-3 text-slate-500 shrink-0" />
        <span>Settings Changed</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
      <RefreshCw className="w-3 h-3 text-slate-500 shrink-0" />
      <span>{action}</span>
    </span>
  );
};

export default ActionBadge;
