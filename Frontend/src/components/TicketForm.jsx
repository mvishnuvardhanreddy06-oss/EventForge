import React, { useState } from 'react';

const TicketForm = ({ eventId, initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    eventId: eventId || initialData.eventId || '',
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || 0,
    quantity: initialData.quantity || 100,
    benefits: initialData.benefits ? initialData.benefits.join(', ') : 'All Technical Sessions, Daily Lunch, Expo Access',
    saleEnd: initialData.saleEnd ? new Date(initialData.saleEnd).toISOString().slice(0, 16) : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Category Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="e.g. VIP All-Access, Early Bird, Corporate"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Price ($ USD) *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Total Quota (Tickets) *</label>
          <input
            type="number"
            required
            min="1"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Sale End Date *</label>
        <input
          type="datetime-local"
          required
          value={formData.saleEnd}
          onChange={e => setFormData({ ...formData, saleEnd: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Benefits (comma separated)</label>
        <input
          type="text"
          value={formData.benefits}
          onChange={e => setFormData({ ...formData, benefits: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="Keynote Access, VIP Dinner, Swag Bag"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving Ticket...' : 'Save Ticket Tier'}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
