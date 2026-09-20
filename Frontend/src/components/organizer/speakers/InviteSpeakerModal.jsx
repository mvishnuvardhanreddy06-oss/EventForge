import React, { useState } from 'react';
import {
  X,
  Send,
  Mail,
  User,
  Calendar,
  Layers,
  Check
} from 'lucide-react';

const DEFAULT_INVITE_MESSAGE = `Hello Sarah,

We would like to invite you to speak at the
Global Tech Leadership Summit 2026.

Please confirm your availability and participation.`;

const InviteSpeakerModal = ({
  isOpen,
  onClose,
  onInvite,
  activeEventName = 'Global Tech Leadership Summit 2026'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventName: activeEventName,
    session: 'AI Infrastructure at Scale',
    message: DEFAULT_INVITE_MESSAGE
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Speaker name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const invitePayload = {
        name: formData.name,
        email: formData.email,
        company: 'Invited Partner',
        designation: 'Keynote Speaker',
        eventName: formData.eventName,
        status: 'invited',
        availability: 'available',
        materialStatus: 'not submitted',
        sessions: formData.session
          ? [{ title: formData.session, dateFormatted: 'Sep 24, 2026', time: '10:00 AM' }]
          : [],
        invitation: {
          sentAt: 'Just now',
          sentBy: 'Vishnureddy',
          deliveryStatus: 'Delivered',
          openedAt: null,
          responseAt: null
        }
      };

      onInvite(invitePayload);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Invite Speaker
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Send an official invitation email to speak at your event
              </p>
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
        <form onSubmit={handleSend} className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
          {/* Speaker Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Speaker Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarah Wilson"
              className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none ${
                errors.name ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@technova.com"
              className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none ${
                errors.email ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Event */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Event <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
            >
              <option value="Global Tech Leadership Summit 2026">Global Tech Leadership Summit 2026</option>
              <option value="AI & Cloud Innovation Conference">AI & Cloud Innovation Conference</option>
              <option value="FinTech Future Forum">FinTech Future Forum</option>
            </select>
          </div>

          {/* Session */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Session
            </label>
            <input
              type="text"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              placeholder="e.g. AI Infrastructure at Scale"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message
            </label>
            <textarea
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteSpeakerModal;
