import React, { useState } from 'react';
import { X } from 'lucide-react';

const SpeakerFormModal = ({ isOpen, speaker, onClose, onSave }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState(
    speaker || {
      name: '',
      designation: 'Chief Technology Officer',
      company: 'TechNova',
      sessionTitle: 'AI Infrastructure at Scale',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop',
      status: 'Confirmed'
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900">
            {speaker ? 'Edit Speaker Profile' : 'Add New Speaker'}
          </h4>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Speaker Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Dr. Ananya Rao"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. VP of Engineering"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company / Org</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Google Cloud"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Speaking Session</label>
            <input
              type="text"
              value={form.sessionTitle}
              onChange={(e) => setForm({ ...form, sessionTitle: e.target.value })}
              placeholder="e.g. Opening Keynote"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
            >
              Save Speaker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpeakerFormModal;
