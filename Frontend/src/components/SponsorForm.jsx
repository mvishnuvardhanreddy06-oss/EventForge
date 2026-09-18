import React, { useState } from 'react';

const SponsorForm = ({ eventId, packages = [], initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    eventId: eventId || initialData.eventId || '',
    companyName: initialData.companyName || '',
    contactPerson: initialData.contactPerson || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    website: initialData.website || '',
    logo: initialData.logo || '',
    packageId: initialData.packageId?._id || initialData.packageId || (packages[0]?._id || '')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
        <input
          type="text"
          required
          value={formData.companyName}
          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="e.g. Google Cloud, Snowflake"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person *</label>
          <input
            type="text"
            required
            value={formData.contactPerson}
            onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Sponsorship Package</label>
          <select
            value={formData.packageId}
            onChange={e => setFormData({ ...formData, packageId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
          >
            <option value="">Select Tier</option>
            {packages.map(p => (
              <option key={p._id} value={p._id}>{p.name} (${p.price})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={e => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Company Logo URL</label>
        <input
          type="url"
          value={formData.logo}
          onChange={e => setFormData({ ...formData, logo: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving Sponsor...' : 'Save Sponsor'}
        </button>
      </div>
    </form>
  );
};

export default SponsorForm;
