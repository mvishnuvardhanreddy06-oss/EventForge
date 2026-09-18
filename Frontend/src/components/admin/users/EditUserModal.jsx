import React, { useState, useEffect } from 'react';
import { X, Edit2, ShieldAlert } from 'lucide-react';

const EditUserModal = ({
  user,
  isOpen,
  onClose,
  onSaveUser
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'attendee',
    organization: 'Nexus Tech Summits',
    status: 'active'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'attendee',
        organization: user.organization || user.organizationId?.name || 'Nexus Tech Summits',
        status: user.status || 'active'
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;
  const isAdmin = user.role === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    // Security check: Platform Admin role cannot be converted, and no other user can become Admin
    if (!isAdmin && formData.role === 'admin') {
      setError('Cannot assign Platform Admin role to another user.');
      return;
    }

    onSaveUser({
      ...user,
      name: formData.name.trim(),
      email: isAdmin ? 'mvishnuvardhanreddy33@gmail.com' : formData.email.trim().toLowerCase(),
      role: isAdmin ? 'admin' : formData.role,
      organization: isAdmin ? 'EventForge Platform' : formData.organization,
      status: isAdmin ? 'active' : formData.status
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {isAdmin ? 'Edit Platform Admin Profile' : 'Edit User Details'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isAdmin ? 'Modify administrator identity' : 'Update account metadata and roles'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Corporate Email {isAdmin && '(Protected)'}
            </label>
            <input
              type="email"
              disabled={isAdmin}
              required
              value={isAdmin ? 'mvishnuvardhanreddy33@gmail.com' : formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 transition-all ${
                isAdmin ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-600 focus:outline-none'
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Role {isAdmin && '(Protected)'}
            </label>
            {isAdmin ? (
              <input
                type="text"
                disabled
                value="Platform Admin"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-100 text-slate-600 cursor-not-allowed font-semibold"
              />
            ) : (
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
              >
                <option value="organizer">Organizer</option>
                <option value="staff">Staff</option>
                <option value="speaker">Speaker</option>
                <option value="sponsor">Sponsor</option>
                <option value="attendee">Attendee</option>
              </select>
            )}
          </div>

          {/* Organization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Organization {isAdmin && '(Protected)'}
            </label>
            {isAdmin ? (
              <input
                type="text"
                disabled
                value="EventForge Platform"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-100 text-slate-600 cursor-not-allowed font-semibold"
              />
            ) : (
              <select
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
              >
                <option value="Apex Global Events">Apex Global Events</option>
                <option value="Nexus Tech Summits">Nexus Tech Summits</option>
                <option value="TechWorld Solutions">TechWorld Solutions</option>
                <option value="CloudScale Dynamics">CloudScale Dynamics</option>
              </select>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Account Status {isAdmin && '(Protected)'}
            </label>
            {isAdmin ? (
              <input
                type="text"
                disabled
                value="Active (Protected)"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-100 text-emerald-700 cursor-not-allowed font-semibold"
              />
            ) : (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
