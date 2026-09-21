import React, { useState, useEffect } from 'react';
import { X, Send, Mail, Users, Shield } from 'lucide-react';

const StaffCommunicationModal = ({
  isOpen,
  recipients = [],
  onClose,
  onSendMessage
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setMessage('');
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const count = recipients.length;
  const recipientNames = recipients.map((r) => `${r.firstName} ${r.lastName}`).join(', ');

  const validate = () => {
    const errs = {};
    if (!subject.trim()) errs.subject = 'Subject is required.';
    if (!message.trim()) errs.message = 'Message body is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSendMessage({
      recipientsCount: count,
      recipientIds: recipients.map((r) => r._id),
      subject: subject.trim(),
      message: message.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Send Message to Staff</h3>
              <p className="text-xs text-slate-500">Dispatch operational broadcast or direct announcement.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-6 space-y-4 text-xs">
          {/* Recipients (Privacy-protected: no emails exposed) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Recipients ({count})
            </span>
            <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
              <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <p className="truncate text-xs">
                {count > 3 ? `${recipients.slice(0, 3).map((r) => `${r.firstName} ${r.lastName}`).join(', ')} + ${count - 3} more` : recipientNames || 'All selected staff'}
              </p>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 pt-0.5">
              <Shield className="w-3 h-3 text-slate-400" />
              <span>Email addresses are kept private and masked.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Schedule Update: Hall A Morning Briefing"
              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                errors.subject ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
              }`}
            />
            {errors.subject && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message instructions, room coordinates or radio channels..."
              className={`w-full px-3 py-2 rounded-xl border text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 resize-none ${
                errors.message ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200 bg-white'
              }`}
            />
            {errors.message && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.message}</p>}
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
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffCommunicationModal;
