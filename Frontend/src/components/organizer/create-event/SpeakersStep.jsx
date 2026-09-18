import React, { useState } from 'react';
import { Plus, User, Edit, Trash2, Mail, CheckCircle2 } from 'lucide-react';
import SpeakerFormModal from './SpeakerFormModal';

const SpeakersStep = ({ formData, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const speakers = formData.speakers || [
    {
      id: 'spk-1',
      name: 'Dr. Ananya Rao',
      designation: 'Chief Technology Officer',
      company: 'TechNova',
      sessionTitle: 'AI Infrastructure at Scale',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop',
      status: 'Confirmed'
    },
    {
      id: 'spk-2',
      name: 'Arjun Mehta',
      designation: 'Principal Cloud Architect',
      company: 'Nexus Global',
      sessionTitle: 'The Future of Autonomous Systems',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop',
      status: 'Confirmed'
    }
  ];

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setEditingSpeaker(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (spk, idx) => {
    setEditingIndex(idx);
    setEditingSpeaker(spk);
    setModalOpen(true);
  };

  const handleRemove = (idx) => {
    onChange('speakers', speakers.filter((_, i) => i !== idx));
  };

  const handleSaveSpeaker = (saved) => {
    if (editingIndex !== null) {
      const updated = [...speakers];
      updated[editingIndex] = saved;
      onChange('speakers', updated);
    } else {
      onChange('speakers', [...speakers, { ...saved, id: `spk-${Date.now()}` }]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Event Speakers
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add keynote speakers, panelists, and session moderators to your conference roster.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Speaker</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {speakers.map((spk, idx) => (
          <div
            key={spk.id || idx}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
          >
            <div className="flex items-start space-x-3 min-w-0">
              <img
                src={spk.avatar}
                alt={spk.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
              />
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{spk.name}</h4>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{spk.status}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold truncate">
                  {spk.designation} · <span className="text-blue-600">{spk.company}</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate pt-0.5">
                  Speaking: <strong>{spk.sessionTitle}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(spk, idx)}
                className="p-1 text-slate-400 hover:text-blue-600"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <SpeakerFormModal
        isOpen={modalOpen}
        speaker={editingSpeaker}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSpeaker}
      />
    </div>
  );
};

export default SpeakersStep;
