import React, { useState } from 'react';
import { X, Mail, Bell, Send, ShieldCheck } from 'lucide-react';

const CommunicationModal = ({
  isOpen,
  onClose,
  recipientsCount = 0,
  channel = 'email', // 'email' or 'notification'
  onSend
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(channel);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }
    if (!message.trim()) {
      setError('Message content is required.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      onSend({
        subject,
        message,
        channel: selectedChannel,
        recipientsCount
      });
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-lg w-full overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center shrink-0">
              {selectedChannel === 'notification' ? <Bell className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {selectedChannel === 'notification' ? 'Broadcast Notification' : 'Compose Attendee Email'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Send updates, instructions, or agenda changes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recipients & Privacy Notice */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">Recipients:</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              {recipientsCount} selected {recipientsCount === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-medium" title="Attendee email addresses are masked for confidentiality">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Privacy protected</span>
          </div>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedChannel('email')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center space-x-1.5 ${
              selectedChannel === 'email'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedChannel('notification')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all flex items-center justify-center space-x-1.5 ${
              selectedChannel === 'notification'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>In-App Notification</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Important Update: Keynote Schedule & Gate Entry Badge"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError('');
              }}
              placeholder="Write your message to the selected attendees..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium leading-relaxed focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {error && <p className="text-[11px] font-semibold text-rose-500">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunicationModal;
