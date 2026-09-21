import React, { useState, useEffect } from 'react';
import { X, Mail, Send, AlertCircle } from 'lucide-react';
import { STAFF_ROLES, MOCK_EVENTS } from '../../../services/staffService';
import {
  extractMobileDigits,
  formatMobileDisplay,
  normalizeIndianPhone
} from '../../../utils/phoneUtils';

const InviteStaffModal = ({
  isOpen,
  events = MOCK_EVENTS,
  selectedEventId = 'evt-1',
  onClose,
  onSendInvitation
}) => {
  const currentEvent = events.find((e) => e._id === selectedEventId) || events[0] || {
    title: 'Global Tech Leadership Summit 2026'
  };

  const defaultMsg = `You have been invited to join the event operations team for ${currentEvent.title}.`;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneDigits: '',
    role: 'Session Coordinator',
    eventId: selectedEventId || events[0]?._id || 'evt-1',
    message: defaultMsg
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phoneDigits: '',
        role: 'Session Coordinator',
        eventId: selectedEventId || events[0]?._id || 'evt-1',
        message: `You have been invited to join the event operations team for ${currentEvent.title}.`
      });
      setErrors({});
    }
  }, [isOpen, selectedEventId]);

  if (!isOpen) return null;

  const handlePhoneChange = (val) => {
    const rawDigits = val.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phoneDigits: rawDigits }));
    if (errors.phoneDigits) {
      setErrors((prev) => ({ ...prev, phoneDigits: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!formData.phoneDigits) {
      errs.phoneDigits = 'Phone number is required.';
    } else if (formData.phoneDigits.length !== 10) {
      errs.phoneDigits = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.role) errs.role = 'Role is required.';
    if (!formData.eventId) errs.eventId = 'Event is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parts = formData.name.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || '';

    const selectedEvt = events.find((ev) => ev._id === formData.eventId);

    const payload = {
      firstName,
      lastName,
      email: formData.email.trim().toLowerCase(),
      phone: normalizeIndianPhone(formData.phoneDigits),
      role: formData.role,
      eventId: formData.eventId,
      eventTitle: selectedEvt ? selectedEvt.title : 'Global Tech Leadership Summit 2026',
      message: formData.message.trim(),
      status: 'Invited'
    };

    onSendInvitation(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Invite Staff Member</h2>
              <p className="text-xs text-slate-500">Send an onboarding invite to a crew coordinator or volunteer.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Shreya Iyer"
              className={`w-full px-3 py-2 rounded-xl border font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                errors.name ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="shreya.iyer@example.com"
                className={`w-full px-3 py-2 rounded-xl border font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                  errors.email ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (+91) <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-blue-600">
                <span className="inline-flex items-center px-2.5 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 select-none">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  value={formatMobileDisplay(formData.phoneDigits)}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="98765 43210"
                  maxLength={11}
                  className="flex-1 px-3 py-2 text-xs font-bold text-slate-900 bg-white focus:outline-hidden tracking-wider"
                />
              </div>
              {errors.phoneDigits && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.phoneDigits}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staff Role <span className="text-rose-500">*</span>
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
                Event <span className="text-rose-500">*</span>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Invitation Message</label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteStaffModal;
