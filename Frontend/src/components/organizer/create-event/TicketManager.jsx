import React, { useState } from 'react';
import { Plus, Trash2, Edit, Check, Ticket, IndianRupee } from 'lucide-react';

const TicketManager = ({ tickets = [], onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    name: '',
    price: 2999,
    quantity: 500,
    description: '',
    salesStart: '2026-08-01',
    salesEnd: '2026-09-24',
    type: 'Standard'
  });

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setTicketForm({
      name: 'VIP Delegate Pass',
      price: 4999,
      quantity: 250,
      description: 'Full all-access pass with executive lounge access and keynote front seating.',
      salesStart: '2026-08-01',
      salesEnd: '2026-09-24',
      type: 'VIP'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (index) => {
    setEditingIndex(index);
    setTicketForm({ ...tickets[index] });
    setModalOpen(true);
  };

  const handleSaveTicket = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...tickets];
      updated[editingIndex] = ticketForm;
      onChange(updated);
    } else {
      onChange([...tickets, ticketForm]);
    }
    setModalOpen(false);
  };

  const handleRemoveTicket = (index) => {
    if (tickets.length <= 1) {
      alert('You must provide at least one ticket tier for attendee registration.');
      return;
    }
    onChange(tickets.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-slate-400">
            Ticket Tiers
          </h4>
          <p className="text-[11px] text-slate-500">Configure passes, pricing, and attendee quotas.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Ticket Type</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {tickets.map((t, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
                  {t.type || 'Standard'}
                </span>
                <h5 className="text-xs font-bold text-slate-900">{t.name}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-2">{t.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-base font-black text-slate-900 block">
                  {t.price === 0 ? 'Free' : `₹${Number(t.price).toLocaleString()}`}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 block">Open</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span>Available: <strong>{Number(t.quantity).toLocaleString()}</strong></span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(idx)}
                  className="p-1 text-slate-500 hover:text-blue-600 font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveTicket(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              {editingIndex !== null ? 'Edit Ticket Tier' : 'Add New Ticket Tier'}
            </h4>

            <form onSubmit={handleSaveTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ticket Name *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  placeholder="e.g. Standard Pass, VIP Pass"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (INR) *</label>
                  <input
                    type="number"
                    min={0}
                    value={ticketForm.price}
                    onChange={(e) => setTicketForm({ ...ticketForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    value={ticketForm.quantity}
                    onChange={(e) => setTicketForm({ ...ticketForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ticket Category</label>
                <select
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  <option>Free</option>
                  <option>Standard</option>
                  <option>VIP</option>
                  <option>Early Bird</option>
                  <option>Student</option>
                  <option>Corporate</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Details on what this ticket includes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManager;
