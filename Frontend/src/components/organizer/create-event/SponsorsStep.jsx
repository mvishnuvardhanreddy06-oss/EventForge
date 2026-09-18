import React, { useState } from 'react';
import { Plus, Award, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import SponsorFormModal from './SponsorFormModal';

const SponsorsStep = ({ formData, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const sponsors = formData.sponsors || [
    {
      id: 'spn-1',
      companyName: 'TechNova Global',
      package: 'Gold Sponsor',
      amount: '₹2,50,000',
      deliverables: 5,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop',
      status: 'Confirmed'
    }
  ];

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setEditingSponsor(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (spn, idx) => {
    setEditingIndex(idx);
    setEditingSponsor(spn);
    setModalOpen(true);
  };

  const handleRemove = (idx) => {
    onChange('sponsors', sponsors.filter((_, i) => i !== idx));
  };

  const handleSave = (saved) => {
    if (editingIndex !== null) {
      const updated = [...sponsors];
      updated[editingIndex] = saved;
      onChange('sponsors', updated);
    } else {
      onChange('sponsors', [...sponsors, { ...saved, id: `spn-${Date.now()}` }]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Event Sponsors & Partnerships
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate sponsorships, branding deliverables, and partner contracts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Sponsor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {sponsors.map((spn, idx) => (
          <div
            key={spn.id || idx}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{spn.companyName}</h4>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{spn.status}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold">
                  {spn.package} · <span className="font-mono text-slate-900">{spn.amount}</span>
                </p>
                <p className="text-[10px] text-slate-400">{spn.deliverables} Deliverables tracked</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(spn, idx)}
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
    </div>
  );
};

export default SponsorsStep;
