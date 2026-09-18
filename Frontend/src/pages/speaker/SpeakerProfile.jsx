import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SpeakerForm from '../../components/SpeakerForm';

const SpeakerProfile = () => {
  const { user } = useAuth();

  const handleSave = (data) => {
    alert('Profile saved successfully!');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Speaker Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Update your public biography, photo, and social links.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <SpeakerForm initialData={user || {}} onSubmit={handleSave} />
      </div>
    </div>
  );
};

export default SpeakerProfile;
