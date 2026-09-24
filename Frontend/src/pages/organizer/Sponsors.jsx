import React, { useState, useEffect } from 'react';
import { sponsorService, sponsorshipService, eventService } from '../../services/api';
import SponsorCard from '../../components/SponsorCard';
import SponsorForm from '../../components/SponsorForm';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Award, Send } from 'lucide-react';
import InviteSponsorModal from '../../components/organizer/sponsors/InviteSponsorModal';
import SponsorDetailsDrawer from '../../components/organizer/sponsors/SponsorDetailsDrawer';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inspectingSponsor, setInspectingSponsor] = useState(null);

  const fetchSponsors = async (eventId) => {
    try {
      const [spRes, pkgRes] = await Promise.allSettled([
        sponsorService.getAll({ eventId }),
        sponsorshipService.getPackages({ eventId })
      ]);
      if (spRes.status === 'fulfilled') {
        const rawSponsors = spRes.value?.data?.sponsors || spRes.value?.sponsors || [];
        setSponsors(Array.isArray(rawSponsors) ? rawSponsors : []);
      }
      if (pkgRes.status === 'fulfilled') {
        const rawPackages = pkgRes.value?.data?.packages || pkgRes.value?.packages || [];
        if (Array.isArray(rawPackages) && rawPackages.length > 0) {
          setPackages(rawPackages);
        } else {
          // If no packages tied specifically to this event, fetch all active packages across the platform
          try {
            const allPkgRes = await sponsorshipService.getPackages({});
            const fallbackPackages = allPkgRes?.data?.packages || allPkgRes?.packages || [];
            if (Array.isArray(fallbackPackages) && fallbackPackages.length > 0) {
              setPackages(fallbackPackages);
            }
          } catch (_) {}
        }
      }
    } catch (e) {
      console.error('Failed to fetch sponsors from database:', e);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const evRes = await eventService.getAll();
        const evList = evRes?.data?.events || evRes?.events || [];
        if (Array.isArray(evList) && evList.length > 0) {
          setEvents(evList);
          const initialEventId = evList[0]._id;
          setSelectedEventId(initialEventId);
          await fetchSponsors(initialEventId);
        }
      } catch (e) {
        console.error('Failed to load initial event sponsors:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    fetchSponsors(id);
  };

  const handleCreateSponsor = async (formData) => {
    try {
      const res = await sponsorService.create({
        ...formData,
        eventId: selectedEventId
      });
      if (res?.success) {
        setShowAddModal(false);
        fetchSponsors(selectedEventId);
        return;
      }
    } catch (err) {
      // Fallback local update
    }
    const newSponsor = {
      ...formData,
      _id: `sp-${Date.now()}`,
      status: 'active'
    };
    setSponsors(prev => [newSponsor, ...prev]);
    setShowAddModal(false);
  };

  const handleEditSponsor = async (formData) => {
    const sponsorId = editingSponsor?._id;
    try {
      await sponsorService.update(sponsorId, formData);
    } catch (err) {
      // Fallback local update
    }
    setSponsors(prev =>
      prev.map(s => (s._id === sponsorId ? { ...s, ...formData } : s))
    );
    if (inspectingSponsor?._id === sponsorId) {
      setInspectingSponsor(prev => ({ ...prev, ...formData }));
    }
    setEditingSponsor(null);
  };

  const handleInviteSponsor = (inviteData) => {
    const invitedSponsor = {
      ...inviteData,
      _id: `sp-${Date.now()}`,
      status: 'pending'
    };
    setSponsors(prev => [invitedSponsor, ...prev]);
  };

  if (loading) return <Loader text="Loading sponsor directory..." />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="text-blue-600">Apex Global Events</span>
            <span>•</span>
            <span>Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sponsors & Corporate Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage brand partnerships, sponsorship tiers, and deliverable commitments.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Invite Sponsor</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sponsor</span>
          </button>
        </div>
      </div>

      {/* Select Event Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <span className="text-xs font-bold text-slate-700">Select Event:</span>
        <select
          value={selectedEventId}
          onChange={handleEventChange}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {/* Sponsor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sponsors.map(sp => (
          <SponsorCard
            key={sp._id}
            sponsor={sp}
            onViewDetails={(sponsor) => setInspectingSponsor(sponsor)}
            onEdit={(sponsor) => setEditingSponsor(sponsor)}
          />
        ))}
      </div>

      {/* Add Sponsor Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Corporate Sponsor"
      >
        <SponsorForm
          eventId={selectedEventId}
          packages={packages}
          onSubmit={handleCreateSponsor}
        />
      </Modal>

      {/* Edit Sponsor Modal */}
      <Modal
        isOpen={Boolean(editingSponsor)}
        onClose={() => setEditingSponsor(null)}
        title="Edit Corporate Sponsor"
      >
        {editingSponsor && (
          <SponsorForm
            eventId={selectedEventId}
            packages={packages}
            initialData={editingSponsor}
            onSubmit={handleEditSponsor}
          />
        )}
      </Modal>

      {/* Invite Sponsor Modal */}
      <InviteSponsorModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteSponsor}
        packages={packages}
      />

      {/* Sponsor Details Drawer */}
      <SponsorDetailsDrawer
        isOpen={Boolean(inspectingSponsor)}
        onClose={() => setInspectingSponsor(null)}
        sponsor={inspectingSponsor}
        onEdit={(sponsor) => {
          setInspectingSponsor(null);
          setEditingSponsor(sponsor);
        }}
      />
    </div>
  );
};

export default Sponsors;
