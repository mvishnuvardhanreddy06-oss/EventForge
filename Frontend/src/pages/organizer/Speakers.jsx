import React, { useState, useEffect } from 'react';
import { speakerService } from '../../services/api';
import SpeakerCard from '../../components/SpeakerCard';
import SpeakerForm from '../../components/SpeakerForm';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Search } from 'lucide-react';

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const fetchSpeakers = async () => {
    try {
      const res = await speakerService.getAll({ search });
      if (res.success) setSpeakers(res.data.speakers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleCreate = async (formData) => {
    try {
      const res = await speakerService.create(formData);
      if (res.success) {
        setShowModal(false);
        fetchSpeakers();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader text="Loading speaker directory..." />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Keynote & Guest Speakers</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage talent rosters, expertise tags, and biography portfolios.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Speaker</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {speakers.map(sp => (
          <SpeakerCard key={sp._id} speaker={sp} />
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Keynote Speaker">
        <SpeakerForm onSubmit={handleCreate} />
      </Modal>
    </div>
  );
};

export default Speakers;
