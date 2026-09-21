import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, FileText, AlertCircle } from 'lucide-react';
import { STAFF_ROLES, MOCK_EVENTS } from '../../../services/staffService';
import {
  extractMobileDigits,
  formatMobileDisplay,
  formatIndianPhone,
  normalizeIndianPhone,
  validateIndianPhone
} from '../../../utils/phoneUtils';

const StaffForm = ({
  isOpen,
  initialData = null,
  events = MOCK_EVENTS,
  onClose,
  onSubmit
}) => {
  const isEditing = Boolean(initialData?._id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneDigits: '',
    profileImage: '',
    role: 'Session Coordinator',
    company: 'EventForge Operations',
    designation: '',
    eventId: 'evt-1',
    department: 'Operations',
    emergencyPhoneDigits: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneDigits: extractMobileDigits(initialData.phone || ''),
        profileImage: initialData.profileImage || '',
        role: initialData.role || 'Session Coordinator',
        company: initialData.company || 'EventForge Operations',
        designation: initialData.designation || '',
        eventId: initialData.eventIds?.[0] || 'evt-1',
        department: initialData.department || 'Operations',
        emergencyPhoneDigits: extractMobileDigits(initialData.emergencyContact || ''),
        notes: initialData.notes || ''
      });
      setErrors({});
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneDigits: '',
        profileImage: '',
        role: 'Session Coordinator',
        company: 'EventForge Operations',
        designation: '',
        eventId: events[0]?._id || 'evt-1',
        department: 'Operations',
        emergencyPhoneDigits: '',
        notes: ''
      });
      setErrors({});
    }
  }, [initialData, isOpen, events]);

  if (!isOpen) return null;

  const handlePhoneChange = (val, field = 'phoneDigits') => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, [field]: rawDigits }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    // Indian Phone Validation: exactly 10 digits
    if (!formData.phoneDigits) {
      newErrors.phoneDigits = 'Phone number is required.';
    } else if (formData.phoneDigits.length !== 10) {
      newErrors.phoneDigits = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (formData.emergencyPhoneDigits && formData.emergencyPhoneDigits.length !== 10) {
      newErrors.emergencyPhoneDigits = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required.';
    }
    if (!formData.eventId) {
      newErrors.eventId = 'Event is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedEvt = events.find((ev) => ev._id === formData.eventId);

    const payload = {
      ...(initialData || {}),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: normalizeIndianPhone(formData.phoneDigits),
      profileImage: formData.profileImage.trim(),
      role: formData.role,
      company: formData.company.trim() || 'EventForge Operations',
      designation: formData.designation.trim() || formData.role,
      eventIds: [formData.eventId],
      eventTitle: selectedEvt ? selectedEvt.title : 'Global Tech Leadership Summit 2026',
      department: formData.department.trim() || 'Operations',
      emergencyContact: formData.emergencyPhoneDigits ? normalizeIndianPhone(formData.emergencyPhoneDigits) : '',
      notes: formData.notes.trim()
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <p className="text-xs text-slate-500">
              Enter staff details, role credentials and event assignment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Rahul"
                className={`w-full px-3 py-2 rounded-xl border font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.firstName ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
                }`}
              />
              {errors.firstName && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Kumar"
                className={`w-full px-3 py-2 rounded-xl border font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.lastName ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
                }`}
              />
              {errors.lastName && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
                className={`w-full px-3 py-2 rounded-xl border font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.email ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>
              )}
            </div>

            {/* Indian Mobile Number with Fixed +91 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (+91) <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600">
                <span className="inline-flex items-center px-3 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={formatMobileDisplay(formData.phoneDigits)}
                  onChange={(e) => handlePhoneChange(e.target.value, 'phoneDigits')}
                  placeholder="98765 43210"
                  maxLength={11} // 10 digits + 1 space
                  className="flex-1 px-3 py-2 text-xs font-bold text-slate-900 bg-white focus:outline-hidden tracking-wider"
                />
              </div>
              {errors.phoneDigits ? (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.phoneDigits}</p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Accepts exactly 10 digits</p>
              )}
            </div>
          </div>

          {/* Role & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Role <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Event <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Agency</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. EventForge Operations"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Operations Coordinator"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Department & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Stage & Session Management"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact (+91)</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-blue-600">
                <span className="inline-flex items-center px-3 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={formatMobileDisplay(formData.emergencyPhoneDigits)}
                  onChange={(e) => handlePhoneChange(e.target.value, 'emergencyPhoneDigits')}
                  placeholder="98111 22233"
                  maxLength={11}
                  className="flex-1 px-3 py-2 text-xs font-bold text-slate-900 bg-white focus:outline-hidden tracking-wider"
                />
              </div>
              {errors.emergencyPhoneDigits && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.emergencyPhoneDigits}</p>
              )}
            </div>
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo URL</label>
            <input
              type="url"
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes & Experience</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any operational experience, special radio channels, or access levels..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              {isEditing ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;
