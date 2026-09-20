import React, { useState, useEffect } from 'react';
import { sponsorService, sponsorshipService, eventService } from '../../services/api';
import SponsorCard from '../../components/SponsorCard';
import SponsorForm from '../../components/SponsorForm';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { Plus, Award, Send } from 'lucide-react';
import InviteSponsorModal from '../../components/organizer/sponsors/InviteSponsorModal';
import SponsorDetailsDrawer from '../../components/organizer/sponsors/SponsorDetailsDrawer';

const MOCK_PACKAGES = [
  { _id: 'pkg-1', name: 'Platinum Tier', price: 500000 },
  { _id: 'pkg-2', name: 'Gold Tier', price: 250000 },
  { _id: 'pkg-3', name: 'Silver Tier', price: 100000 }
];

const INITIAL_SPONSORS = [
  {
    _id: 'sp-101',
    companyName: 'TechNova Solutions',
    contactPerson: 'Rajesh Sharma',
    email: 'partnerships@technova.io',
    phone: '+919876543210',
    paymentContactPerson: 'Suresh Kumar',
    paymentPhone: '+919812345678',
    contractContactPerson: 'Pooja Verma',
    contractPhone: '+919898765432',
    packageId: { _id: 'pkg-1', name: 'Platinum Tier' },
    website: 'https://technova.io',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop',
    status: 'active'
  },
  {
    _id: 'sp-102',
    companyName: 'CloudScale Technologies',
    contactPerson: 'Ananya Deshmukh',
    email: 'sponsorship@cloudscale.in',
    phone: '+919823456789',
    paymentContactPerson: 'Vikram Rao',
    paymentPhone: '+919834567890',
    contractContactPerson: 'Ananya Deshmukh',
    contractPhone: '+919823456789',
    packageId: { _id: 'pkg-2', name: 'Gold Tier' },
    website: 'https://cloudscale.in',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop',
    status: 'approved'
  },
  {
    _id: 'sp-103',
    companyName: 'FinCore Labs',
    contactPerson: 'Amitabh Sen',
    email: 'events@fincore.org',
    phone: '+919845012345',
    paymentContactPerson: 'Kavita Menon',
    paymentPhone: '+919867012345',
    contractContactPerson: 'Amitabh Sen',
    contractPhone: '+919845012345',
    packageId: { _id: 'pkg-3', name: 'Silver Tier' },
    website: 'https://fincore.org',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop',
    status: 'active'
  }
];

const Sponsors = () => {
  const [sponsors, setSponsors] = useState(INITIAL_SPONSORS);
  const [events, setEvents] = useState([
    { _id: 'evt-1', title: 'Global Tech Leadership Summit 2026' },
    { _id: 'evt-2', title: 'AI & Cloud Innovation Conference' },
    { _id: 'evt-3', title: 'FinTech Future Forum' }
  ]);
  const [selectedEventId, setSelectedEventId] = useState('evt-1');
  const [packages, setPackages] = useState(MOCK_PACKAGES);
  const [loading, setLoading] = useState(false);

  // Modals & Drawers State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inspectingSponsor, setInspectingSponsor] = useState(null);

  const fetchSponsors = async (eventId) => {
    try {
      const [spRes, pkgRes] = await Promise.all([
        sponsorService.getAll({ eventId }),
        sponsorshipService.getPackages({ eventId })
      ]);
      if (spRes?.success && spRes.data?.sponsors?.length > 0) {
        setSponsors(spRes.data.sponsors);
      }
      if (pkgRes?.success && pkgRes.data?.packages?.length > 0) {
        setPackages(pkgRes.data.packages);
      }
    } catch (e) {
      console.info('API fallback active; displaying enterprise sponsor roster.');
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const evRes = await eventService.getAll();
        if (evRes?.success && evRes.data?.events?.length > 0) {
          setEvents(evRes.data.events);
          const initialEventId = evRes.data.events[0]._id;
          setSelectedEventId(initialEventId);
          await fetchSponsors(initialEventId);
        }
      } catch (e) {
        console.info('Using local event state.');
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
