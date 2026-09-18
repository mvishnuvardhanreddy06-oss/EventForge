import React, { useState, useEffect } from 'react';
import { sponsorshipService, eventService } from '../../services/api';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Award, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const SponsorshipPackages = () => {
  const [packages, setPackages] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: 'Platinum Tier', price: 20000, availableSlots: 3, description: 'Premier brand prominence and keynote mention.', benefits: 'Keynote Mention, 40x40 Booth, 20 VIP Passes' });

  const fetchPackages = async (eventId) => {
    try {
      const res = await sponsorshipService.getPackages({ eventId });
      if (res.success) setPackages(res.data.packages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes.success && evRes.data.events.length > 0) {
          setEvents(evRes.data.events);
          const id = evRes.data.events[0]._id;
          setSelectedEventId(id);
          await fetchPackages(id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await sponsorshipService.createPackage({
        eventId: selectedEventId,
        name: form.name,
        price: Number(form.price),
        availableSlots: Number(form.availableSlots),
        description: form.description,
        benefits: form.benefits.split(',').map(b => b.trim()).filter(Boolean)
      });
      setShowModal(false);
      fetchPackages(selectedEventId);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading sponsorship tiers..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sponsorship Packages</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure tier pricing, benefit checklists, and available partner slots.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-black text-slate-900">{pkg.name}</h3>
                <span className="text-xs font-bold text-slate-400">{pkg.availableSlots} Slots</span>
              </div>
              <div className="text-2xl font-black text-blue-600 mb-3">
                {formatCurrency(pkg.price)}
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                {pkg.description}
              </p>
              <ul className="space-y-2 mb-6">
                {(pkg.benefits || []).map((b, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
              <span>Status: <strong className="text-emerald-600 capitalize">{pkg.status}</strong></span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Sponsorship Tier">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Package Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ($ USD) *</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Slots *</label>
              <input
                type="number"
                required
                min="1"
                value={form.availableSlots}
                onChange={e => setForm({ ...form, availableSlots: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Benefits (comma separated)</label>
            <input
              type="text"
              value={form.benefits}
              onChange={e => setForm({ ...form, benefits: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
            >
              Save Package
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SponsorshipPackages;
