import React, { useState, useEffect } from 'react';
import { organizationService } from '../../services/api';
import Loader from '../../components/Loader';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Building, Plus, CheckCircle, XCircle } from 'lucide-react';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', description: '', subscriptionPlan: 'Enterprise' });

  const fetchOrgs = async () => {
    try {
      const res = await organizationService.getAll();
      if (res.success) setOrganizations(res.data.organizations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await organizationService.toggleStatus(id);
      fetchOrgs();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await organizationService.create(form);
      setShowModal(false);
      setForm({ name: '', email: '', description: '', subscriptionPlan: 'Enterprise' });
      fetchOrgs();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading organizations..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organizations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage platform enterprises and corporate organizers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Organization</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {organizations.map((org) => (
          <div key={org._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  <Building className="w-5 h-5" />
                </div>
                <Badge status={org.isActive ? 'active' : 'inactive'} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{org.name}</h3>
              <p className="text-xs text-blue-600 font-semibold mb-2">Plan: {org.subscriptionPlan}</p>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{org.description || 'Enterprise corporate organizer.'}</p>
              <p className="text-[11px] text-slate-400">Contact: {org.email}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(org._id)}
                className={`text-xs font-bold transition-colors ${
                  org.isActive ? 'text-rose-600 hover:text-rose-800' : 'text-emerald-600 hover:text-emerald-800'
                }`}
              >
                {org.isActive ? 'Deactivate Tenant' : 'Activate Tenant'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Organization">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Organization Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Contact Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subscription Plan</label>
            <select
              value={form.subscriptionPlan}
              onChange={e => setForm({ ...form, subscriptionPlan: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            >
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
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
              Create Organization
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Organizations;
