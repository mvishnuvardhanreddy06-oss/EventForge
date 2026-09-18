import React, { useState, useEffect } from 'react';
import { sponsorService } from '../../services/api';
import SponsorForm from '../../components/SponsorForm';
import Loader from '../../components/Loader';

const SponsorProfile = () => {
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await sponsorService.getAll();
        if (res.success && res.data.sponsors.length > 0) {
          setSponsor(res.data.sponsors[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (formData) => {
    if (!sponsor) return;
    try {
      await sponsorService.update(sponsor._id, formData);
      alert('Sponsor profile updated successfully!');
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading company profile..." />;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Sponsor Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage brand details, official website, logo URL, and contact representative.</p>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <SponsorForm initialData={sponsor || {}} onSubmit={handleSave} />
      </div>
    </div>
  );
};

export default SponsorProfile;
