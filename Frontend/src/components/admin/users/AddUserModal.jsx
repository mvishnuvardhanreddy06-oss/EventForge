import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'organizer',
    organization: 'Apex Global Events',
    status: 'active'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('A valid corporate email is required.');
      return;
    }

    // Security Check: Strictly prevent creating a second Platform Admin
    if (formData.role === 'admin') {
      setError('Creation of additional Platform Admin accounts is restricted.');
      return;
    }

    onAddUser({
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      organization: formData.organization,
      status: formData.status,
      joined: 'Today, 2026',
      lastActive: 'Just now'
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
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Add Platform User
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Provision a new stakeholder account on EventForge
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

        {/* Modal Form */}
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
              placeholder="e.g. Rachel Adams"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* Corporate Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Corporate Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@enterprise.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* Role (Platform Admin is strictly excluded) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              System Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            >
              <option value="organizer">Event Organizer</option>
              <option value="staff">Operations Staff</option>
              <option value="speaker">Keynote Speaker</option>
              <option value="sponsor">Corporate Sponsor</option>
              <option value="attendee">Attendee Delegate</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Platform Admin role is restricted to the single primary administrator.
            </span>
          </div>

          {/* Organization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Organization Tenant *
            </label>
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
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Account Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="pending">Pending Verification</option>
            </select>
          </div>

          {/* Buttons */}
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
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
