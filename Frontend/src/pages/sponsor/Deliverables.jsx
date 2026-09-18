import React, { useState, useEffect } from 'react';
import { sponsorService, sponsorshipService } from '../../services/api';
import DeliverableTracker from '../../components/DeliverableTracker';
import Loader from '../../components/Loader';

const Deliverables = () => {
  const [sponsorship, setSponsorship] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSponsorship = async () => {
    try {
      const res = await sponsorService.getAll();
      if (res.success && res.data.sponsors.length > 0) {
        const sp = res.data.sponsors[0];
        const detail = await sponsorService.getById(sp._id);
        if (detail.success) setSponsorship(detail.data.sponsorship);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorship();
  }, []);

  const handleUpdateStatus = async (deliverableId, status) => {
    if (!sponsorship) return;
    try {
      await sponsorshipService.updateDeliverable(sponsorship._id, deliverableId, status);
      fetchSponsorship();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <Loader text="Loading contract deliverables..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deliverables Tracker</h1>
        <p className="text-xs text-slate-500 mt-0.5">Update status of contract items (logos, booth schematics, keynote bios).</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <DeliverableTracker
          deliverables={sponsorship?.deliverables || []}
          canEdit={true}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  );
};

export default Deliverables;
