import React, { useState } from 'react';

const SpeakerForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    designation: initialData.designation || '',
    company: initialData.company || '',
    bio: initialData.bio || '',
    expertise: initialData.expertise ? initialData.expertise.join(', ') : 'AI, Cloud, Distributed Systems',
    twitter: initialData.socialLinks?.twitter || '',
    linkedin: initialData.socialLinks?.linkedin || '',
    github: initialData.socialLinks?.github || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      designation: formData.designation,
      company: formData.company,
      bio: formData.bio,
      expertise: formData.expertise.split(',').map(e => e.trim()).filter(Boolean),
      socialLinks: {
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        github: formData.github
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Speaker Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Dr. Priya Sharma"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
          <input
            type="text"
            required
            value={formData.designation}
            onChange={e => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="VP of AI Research"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="DeepNeural Labs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Expertise (comma separated)</label>
          <input
            type="text"
            value={formData.expertise}
            onChange={e => setFormData({ ...formData, expertise: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="Artificial Intelligence, Cloud, Security"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Biography *</label>
        <textarea
          rows="3"
          required
          value={formData.bio}
          onChange={e => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
          placeholder="Speaker background, career highlights, and publications..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Twitter URL</label>
          <input
            type="url"
            value={formData.twitter}
            onChange={e => setFormData({ ...formData, twitter: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="https://twitter.com/..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label>
          <input
            type="url"
            value={formData.github}
            onChange={e => setFormData({ ...formData, github: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving Speaker...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default SpeakerForm;
