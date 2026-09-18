import React from 'react';
import UserRow from './UserRow';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';
import { Eye, ShieldCheck } from 'lucide-react';

const getInitials = (name, role) => {
  if (role === 'admin' || (name && name.toLowerCase().includes('vishnu'))) return 'VR';
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
};

const UserTable = ({
  users,
  onView,
  onEdit,
  onSuspend,
  onActivate
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Organization</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Joined</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {users.map((user) => (
              <UserRow
                key={user.id || user._id}
                user={user}
                onView={onView}
                onEdit={onEdit}
                onSuspend={onSuspend}
                onActivate={onActivate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (No horizontal squeezing) */}
      <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
        {users.map((user) => {
          const isAdmin = user.role === 'admin';
          const initials = getInitials(user.name, user.role);

          return (
            <div
              key={user.id || user._id}
              className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/70 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {user.name}
                      </h4>
                      {isAdmin && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <StatusBadge status={user.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Role
                  </span>
                  <div className="mt-1">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Organization
                  </span>
                  <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                    {isAdmin ? 'EventForge Platform' : user.organization || 'Nexus Tech Summits'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Joined {user.joined || 'Aug 01, 2026'}</span>
                <button
                  type="button"
                  onClick={() => onView(user)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors inline-flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTable;
