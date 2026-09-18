import React, { useState, useRef, useEffect } from 'react';
import RoleBadge from './RoleBadge';
import StatusBadge from './StatusBadge';
import { MoreVertical, Eye, Edit2, Ban, CheckCircle, ShieldCheck } from 'lucide-react';

const getInitials = (name, role) => {
  if (role === 'admin' || (name && name.toLowerCase().includes('vishnu'))) {
    return 'VR';
  }
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarColor = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-slate-900 text-white';
    case 'organizer':
      return 'bg-blue-600 text-white';
    case 'staff':
      return 'bg-cyan-600 text-white';
    case 'speaker':
      return 'bg-indigo-600 text-white';
    case 'sponsor':
      return 'bg-amber-600 text-white';
    case 'attendee':
    default:
      return 'bg-slate-200 text-slate-700';
  }
};

const UserRow = ({
  user,
  onView,
  onEdit,
  onSuspend,
  onActivate
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = getInitials(user.name, user.role);
  const avatarColor = getAvatarColor(user.role);

  return (
    <tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-100/90">
      {/* User Identity */}
      <td className="py-3.5 px-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${avatarColor}`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-xs truncate">
                {user.name}
              </span>
              {isAdmin && (
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" title="Protected Platform Administrator" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="py-3.5 px-4">
        <RoleBadge role={user.role} />
      </td>

      {/* Organization */}
      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 truncate max-w-[180px]">
        {isAdmin ? (
          <span className="text-slate-900 font-bold">EventForge Platform</span>
        ) : (
          user.organization || user.organizationId?.name || 'Nexus Tech Summits'
        )}
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <StatusBadge status={user.status} />
      </td>

      {/* Joined Date */}
      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
        {user.joined || 'Aug 01, 2026'}
      </td>

      {/* Last Active */}
      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
        {user.lastActive || 'Today'}
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end space-x-1.5 relative">
          <button
            type="button"
            onClick={() => onView(user)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {/* Context Action Menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200/90 py-1.5 z-40 text-left text-xs animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onView(user);
                  }}
                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(user);
                  }}
                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAdmin ? 'Edit Profile' : 'Edit User'}</span>
                </button>

                {!isAdmin && (
                  <>
                    <div className="border-t border-slate-100 my-1" />
                    {user.status === 'suspended' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onActivate(user);
                        }}
                        className="w-full px-3 py-2 hover:bg-emerald-50 flex items-center space-x-2 text-emerald-700 font-medium"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Activate User</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onSuspend(user);
                        }}
                        className="w-full px-3 py-2 hover:bg-rose-50 flex items-center space-x-2 text-rose-700 font-medium"
                      >
                        <Ban className="w-3.5 h-3.5 text-rose-600" />
                        <span>Suspend User</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
