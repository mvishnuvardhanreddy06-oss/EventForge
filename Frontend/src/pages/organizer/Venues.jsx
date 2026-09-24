import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { venueService } from '../../services/api';
import VenueSummaryCards from '../../components/organizer/venues/VenueSummaryCards';
import VenueToolbar from '../../components/organizer/venues/VenueToolbar';
import VenueGrid from '../../components/organizer/venues/VenueGrid';
import VenueList from '../../components/organizer/venues/VenueList';
import VenueFormModal from '../../components/organizer/venues/VenueFormModal';
import VenueDetailsDrawer from '../../components/organizer/venues/VenueDetailsDrawer';
import DeactivateVenueModal from '../../components/organizer/venues/DeactivateVenueModal';
import VenueConflictAlert from '../../components/organizer/venues/VenueConflictAlert';
import { NoVenuesState, NoSearchResultsState } from '../../components/organizer/venues/EmptyState';
import Pagination from '../../components/organizer/venues/Pagination';
import ToastNotification from '../../components/organizer/venues/ToastNotification';

const INITIAL_ORGANIZER_VENUES = [
  {
    id: 'venue-1',
    name: 'Hyderabad International Convention Centre',
    type: 'Convention Center',
    status: 'available',
    description: 'South Asia’s premier purpose-built convention facility featuring column-free pillarless halls, state-of-the-art audiovisual rigs, and high-speed multi-gigabit mesh networking.',
    address: 'Novotel & HICC Complex, HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500081',
    capacity: 3200,
    roomCount: 12,
    rooms: [
      { name: 'Grand Ballroom', capacity: 2000, floor: 'Ground' },
      { name: 'Hall 1 (Pillarless)', capacity: 600, floor: 'Ground' },
      { name: 'Hall 2 (Keynote Suite)', capacity: 400, floor: 'Ground' },
      { name: 'Breakout Suite A', capacity: 100, floor: '1st Floor' },
      { name: 'Breakout Suite B', capacity: 100, floor: '1st Floor' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'AV Equipment', 'LED Screens', 'Stage', 'Accessibility', 'Security', 'Backup Power'],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Rajesh Verma (Operations Director)',
    contactEmail: 'rajesh.verma@hicc-events.in',
    contactPhone: '+91 40 6682 4422',
    website: 'https://www.hicc.com',
    organizationId: 'org-apex-01',
    currentEvent: null,
    upcomingBookings: [
      {
        id: 'bk-1',
        title: 'Global Tech Leadership Summit',
        date: 'Sep 24, 2026',
        time: '09:00 AM – 06:00 PM',
        room: 'Main Plenary Hall'
      },
      {
        id: 'bk-2',
        title: 'AI & Cloud Innovation Conference',
        date: 'Oct 04, 2026',
        time: '09:00 AM – 05:00 PM',
        room: 'Conference Hall A'
      }
    ]
  },
  {
    id: 'venue-2',
    name: 'TechPark Convention Hall',
    type: 'Conference Hall',
    status: 'booked',
    description: 'Modern corporate hall located directly in the Bengaluru IT corridor, specialized for technology product announcements, investor summits, and developer hackathons.',
    address: 'ITPL Main Road, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560066',
    capacity: 1800,
    roomCount: 6,
    rooms: [
      { name: 'Innovation Hall', capacity: 1000, floor: '1st Floor' },
      { name: 'Quantum Suite', capacity: 500, floor: '2nd Floor' },
      { name: 'Alpha Stage', capacity: 300, floor: 'Ground' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'Projector', 'LED Screens', 'Audio / PA System', 'Live Streaming'],
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Anita Rao (General Manager)',
    contactEmail: 'anita.rao@techpark.org',
    contactPhone: '+91 80 4129 8800',
    website: 'https://www.techparkbangalore.com',
    organizationId: 'org-apex-01',
    currentEvent: {
      title: 'AI & Cloud Innovation Conference',
      date: 'Sep 04, 2026'
    },
    upcomingBookings: [
      {
        id: 'bk-3',
        title: 'AI & Cloud Innovation Conference',
        date: 'Sep 04, 2026',
        time: '10:00 AM – 05:30 PM',
        room: 'Innovation Hall'
      }
    ]
  },
  {
    id: 'venue-3',
    name: 'Chennai Trade & Exhibition Centre',
    type: 'Convention Center',
    status: 'available',
    description: 'Expansive multi-hall exhibition and convention grounds suited for industrial expos, B2B trade delegations, and international consumer conventions.',
    address: 'Mount Poonamallee Road, Nandambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    postalCode: '600089',
    capacity: 1500,
    roomCount: 8,
    rooms: [
      { name: 'Convention Hall A', capacity: 900, floor: 'Ground' },
      { name: 'Convention Hall B', capacity: 400, floor: 'Ground' },
      { name: 'VIP Executive Pavilion', capacity: 200, floor: '1st Floor' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'Stage', 'Accessibility', 'Security', 'Backup Power', 'Photography'],
    images: [
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'K. Sundaram (Events Registrar)',
    contactEmail: 'k.sundaram@chennaitrade.org',
    contactPhone: '+91 44 2256 0001',
    website: 'https://www.chennaitradecentre.org',
    organizationId: 'org-apex-01',
    currentEvent: null,
    upcomingBookings: [
      {
        id: 'bk-4',
        title: 'Southern India FinTech Expo',
        date: 'Nov 15, 2026',
        time: '09:00 AM – 06:00 PM',
        room: 'Convention Hall A'
      }
    ]
  },
  {
    id: 'venue-4',
    name: 'ITC Grand Chola Conference Arena',
    type: 'Hotel',
    status: 'available',
    description: 'Palatial luxury conference suites inspired by classic Chola dynasty architecture, equipped with five-star catering banquet facilities and private dignitary lounges.',
    address: '63 Anna Salai, Guindy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    postalCode: '600032',
    capacity: 650,
    roomCount: 5,
    rooms: [
      { name: 'Rajendra Grand Hall', capacity: 450, floor: 'Ground' },
      { name: 'Tanjore Meeting Room', capacity: 120, floor: '1st Floor' },
      { name: 'Kaveri Boardroom', capacity: 80, floor: '1st Floor' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'Audio / PA System', 'Projector', 'Stage', 'Accessibility'],
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Priya Nair (Banquet Sales)',
    contactEmail: 'priya.nair@itchotels.in',
    contactPhone: '+91 44 2220 0000',
    website: 'https://www.itchotels.com/grandchola',
    organizationId: 'org-apex-01',
    currentEvent: null,
    upcomingBookings: []
  },
  {
    id: 'venue-5',
    name: 'Mumbai World Trade Centre',
    type: 'Convention Center',
    status: 'available',
    description: 'Iconic business nexus in South Mumbai providing waterfront plenary halls, simultaneous translation cubicles, and financial district proximity.',
    address: 'Cuffe Parade, Colaba',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400005',
    capacity: 550,
    roomCount: 4,
    rooms: [
      { name: 'Centrum Plenary', capacity: 350, floor: 'Arcade Level' },
      { name: 'South Lounge', capacity: 120, floor: '1st Floor' },
      { name: 'Director Suite', capacity: 80, floor: '2nd Floor' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'LED Screens', 'Security', 'Live Streaming', 'Backup Power'],
    images: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Vikram Mehta (VP Operations)',
    contactEmail: 'v.mehta@wtcmumbai.org',
    contactPhone: '+91 22 6601 1234',
    website: 'https://www.wtcmumbai.org',
    organizationId: 'org-apex-01',
    currentEvent: null,
    upcomingBookings: [
      {
        id: 'bk-5',
        title: 'CyberSecurity Horizons 2026',
        date: 'Nov 12, 2026',
        time: '09:00 AM – 05:30 PM',
        room: 'Centrum Plenary'
      }
    ]
  },
  {
    id: 'venue-6',
    name: 'The Lalit New Delhi Grand Ballroom',
    type: 'Hotel',
    status: 'maintenance',
    description: 'Central Connaught Place luxury property ballroom currently undergoing complete acoustics, projection mapping, and intelligent lighting overhaul.',
    address: 'Barakhamba Avenue, Connaught Place',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    postalCode: '110001',
    capacity: 350,
    roomCount: 3,
    rooms: [
      { name: 'Crystal Ballroom', capacity: 250, floor: 'Lower Ground' },
      { name: 'Regency Room', capacity: 100, floor: 'Ground' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'Projector', 'Audio / PA System', 'Stage'],
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Sanjay Kapoor (Facility Engineer)',
    contactEmail: 'skapoor@thelalit.com',
    contactPhone: '+91 11 4444 7777',
    website: 'https://www.thelalit.com/delhi',
    organizationId: 'org-apex-01',
    currentEvent: null,
    upcomingBookings: []
  },
  {
    id: 'venue-7',
    name: 'Pragati Maidan Plenary Hall',
    type: 'Auditorium',
    status: 'available',
    description: 'National showcase auditorium with tiered amphitheater seating, broadcast-grade acoustic design, and dedicated media centers.',
    address: 'Mathura Road, Pragati Maidan',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    postalCode: '110001',
    capacity: 250,
    roomCount: 2,
    rooms: [
      { name: 'Plenary Hall A', capacity: 180, floor: 'Ground' },
      { name: 'Press Briefing Suite', capacity: 70, floor: '1st Floor' }
    ],
    facilities: ['Wi-Fi', 'Parking', 'Catering', 'Stage', 'Audio / PA System', 'LED Screens', 'Security', 'Backup Power'],
    images: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Meenakshi Sharma (Admin Head)',
    contactEmail: 'm.sharma@itpo.gov.in',
    contactPhone: '+91 11 2337 1540',
    website: 'https://www.indiatradefair.com',
    organizationId: 'org-apex-01',
    currentEvent: null,
    upcomingBookings: []
  },
  {
    id: 'venue-8',
    name: 'HITEC City Open-Air Amphitheatre',
    type: 'Outdoor',
    status: 'booked',
    description: 'Terraced open-air amphitheater surrounded by landscaped botanical gardens, designed for tech networking mixers, product festivals, and hackathon celebrations.',
    address: 'Madhapur, HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500081',
    capacity: 150,
    roomCount: 2,
    rooms: [
      { name: 'Amphitheatre Stage', capacity: 120, floor: 'Ground' },
      { name: 'Backstage Pavilion', capacity: 30, floor: 'Ground' }
    ],
    facilities: ['Parking', 'Stage', 'Audio / PA System', 'Security', 'Backup Power', 'Photography'],
    images: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop'
    ],
    contactPerson: 'Arun Kumar (Festival Coordinator)',
    contactEmail: 'arun.k@hitecvenues.com',
    contactPhone: '+91 40 4010 5500',
    website: 'https://www.hitecvenues.com',
    organizationId: 'org-apex-01',
    currentEvent: {
      title: 'Annual Cultural TechFest 2026',
      date: 'Sep 18, 2026'
    },
    upcomingBookings: [
      {
        id: 'bk-6',
        title: 'Annual Cultural TechFest 2026',
        date: 'Sep 18, 2026',
        time: '04:00 PM – 10:00 PM',
        room: 'Amphitheatre Stage'
      }
    ]
  }
];

const Venues = () => {
  const [venues, setVenues] = useState(INITIAL_ORGANIZER_VENUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [venueTypeFilter, setVenueTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals & Drawers state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [selectedDrawerVenue, setSelectedDrawerVenue] = useState(null);
  const [deactivatingVenue, setDeactivatingVenue] = useState(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync with API
  useEffect(() => {
    const loadVenues = async () => {
      try {
        const res = await venueService.getAll();
        const rawVenues = res?.data?.venues || res?.venues || (Array.isArray(res?.data) ? res.data : null);
        if (Array.isArray(rawVenues) && rawVenues.length > 0) {
          const mapped = rawVenues.map((apiVenue, idx) => ({
            ...apiVenue,
            id: apiVenue._id || apiVenue.id,
            roomCount: apiVenue.rooms?.length || 1,
            status: apiVenue.status || 'available',
            images: apiVenue.images?.length > 0 ? apiVenue.images : [
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
            ]
          }));
          setVenues(mapped);
        }
      } catch (err) {
        console.error('Error loading venues from database:', err);
      }
    };
    loadVenues();
  }, []);

  // Compute Summary Statistics
  const stats = useMemo(() => {
    const total = venues.length;
    const available = venues.filter((v) => v.status === 'available').length;
    const booked = venues.filter((v) => v.status === 'booked' || Boolean(v.currentEvent)).length;
    const totalCapacity = venues.reduce((sum, v) => sum + (Number(v.capacity) || 0), 0);
    return { total, available, booked, totalCapacity };
  }, [venues]);

  // Filter & Search Logic
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = venue.name?.toLowerCase().includes(q);
        const matchesCity = venue.city?.toLowerCase().includes(q);
        const matchesAddress = venue.address?.toLowerCase().includes(q);
        const matchesFacility = venue.facilities?.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesAddress && !matchesFacility) {
          return false;
        }
      }

      // Availability Filter
      if (availabilityFilter !== 'all') {
        const isBooked = venue.status === 'booked' || Boolean(venue.currentEvent);
        if (availabilityFilter === 'booked' && !isBooked) return false;
        if (availabilityFilter === 'available' && venue.status !== 'available') return false;
        if (availabilityFilter === 'maintenance' && venue.status !== 'maintenance') return false;
        if (availabilityFilter === 'inactive' && venue.status !== 'inactive') return false;
      }

      // Venue Type Filter
      if (venueTypeFilter !== 'all') {
        if (venue.type?.toLowerCase() !== venueTypeFilter.toLowerCase()) {
          return false;
        }
      }

      // City Filter
      if (cityFilter !== 'all') {
        if (venue.city?.toLowerCase() !== cityFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [venues, searchQuery, availabilityFilter, venueTypeFilter, cityFilter]);

  // Pagination slice
  const paginatedVenues = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVenues.slice(start, start + pageSize);
  }, [filteredVenues, currentPage, pageSize]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    availabilityFilter !== 'all' ||
    venueTypeFilter !== 'all' ||
    cityFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('all');
    setVenueTypeFilter('all');
    setCityFilter('all');
    setCurrentPage(1);
  };

  // Actions
  const handleOpenAddModal = () => {
    setEditingVenue(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (venue) => {
    setEditingVenue(venue);
    setIsFormModalOpen(true);
  };

  const handleSaveVenue = (savedData) => {
    if (editingVenue) {
      setVenues((prev) =>
        prev.map((v) => (v.id === savedData.id || v._id === savedData.id ? savedData : v))
      );
      if (selectedDrawerVenue && (selectedDrawerVenue.id === savedData.id || selectedDrawerVenue._id === savedData.id)) {
        setSelectedDrawerVenue(savedData);
      }
      setToast({ type: 'success', message: '✓ Venue updated successfully.' });
    } else {
      setVenues((prev) => [savedData, ...prev]);
      setToast({ type: 'success', message: '✓ Venue added successfully.' });
    }
    setIsFormModalOpen(false);
  };

  const handleDuplicateVenue = (venue) => {
    const duplicate = {
      ...venue,
      id: `venue-${Date.now()}`,
      name: `Copy of ${venue.name}`,
      status: 'available',
      currentEvent: null,
      upcomingBookings: []
    };
    setVenues((prev) => [duplicate, ...prev]);
    setToast({ type: 'success', message: `✓ Duplicated "${venue.name}" into a new available venue.` });
  };

  const handleToggleMaintenance = (venue) => {
    const newStatus = venue.status === 'maintenance' ? 'available' : 'maintenance';
    setVenues((prev) =>
      prev.map((v) => (v.id === venue.id || v._id === venue.id ? { ...v, status: newStatus } : v))
    );
    if (selectedDrawerVenue && (selectedDrawerVenue.id === venue.id || selectedDrawerVenue._id === venue.id)) {
      setSelectedDrawerVenue({ ...selectedDrawerVenue, status: newStatus });
    }
    setToast({
      type: 'info',
      message: newStatus === 'maintenance'
        ? `"${venue.name}" set to facility maintenance.`
        : `"${venue.name}" restored to available status.`
    });
  };

  const handleOpenDeactivateModal = (venue) => {
    setDeactivatingVenue(venue);
  };

  const handleConfirmDeactivate = (venue) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === venue.id || v._id === venue.id ? { ...v, status: 'inactive' } : v))
    );
    if (selectedDrawerVenue && (selectedDrawerVenue.id === venue.id || selectedDrawerVenue._id === venue.id)) {
      setSelectedDrawerVenue({ ...selectedDrawerVenue, status: 'inactive' });
    }
    setDeactivatingVenue(null);
    setToast({
      type: 'info',
      message: `"${venue.name}" has been deactivated. Historical event records remain preserved.`
    });
  };

  const handleConfirmActivate = (venue) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === venue.id || v._id === venue.id ? { ...v, status: 'available' } : v))
    );
    if (selectedDrawerVenue && (selectedDrawerVenue.id === venue.id || selectedDrawerVenue._id === venue.id)) {
      setSelectedDrawerVenue({ ...selectedDrawerVenue, status: 'available' });
    }
    setDeactivatingVenue(null);
    setToast({
      type: 'success',
      message: `"${venue.name}" has been reactivated and is now available for event bookings.`
    });
  };

  const handleSimulateConflict = async () => {
    try {
      const res = await venueService.getAllConflicts();
      const conflictList = res?.data?.conflicts || res?.conflicts || [];
      if (conflictList.length > 0) {
        const first = conflictList[0];
        setConflictData({
          venueName: first.venueName,
          existingEvent: `${first.event1.title} ⚡ Collides with: ${first.event2.title}`,
          date: `${new Date(first.event1.startDate).toLocaleDateString()} – ${new Date(first.event1.endDate).toLocaleDateString()}`,
          time: 'Overlapping Event Dates',
          room: 'Shared Venue Location'
        });
        setIsConflictModalOpen(true);
      } else {
        setToast({
          type: 'success',
          message: '✓ Venue Conflict Engine: 0 overlapping events detected across all registered venues.'
        });
      }
    } catch (err) {
      setConflictData({
        venueName: 'Hyderabad International Convention Centre',
        existingEvent: 'Global Tech Leadership Summit',
        date: 'September 24, 2026',
        time: '09:00 AM – 06:00 PM',
        room: 'Main Plenary Hall'
      });
      setIsConflictModalOpen(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Venues
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Apex Global Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage event venues, rooms, capacity and facilities for your organization.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Conflict Test Trigger for Quick Demonstration */}
          <button
            type="button"
            onClick={handleSimulateConflict}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
            title="Simulate a venue booking collision alert"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Check Conflict Engine</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Venue</span>
          </button>
        </div>
      </div>

      {/* 2. Summary KPI Cards */}
      <VenueSummaryCards
        stats={stats}
        activeFilter={availabilityFilter}
        onFilterChange={(filterVal) => {
          setAvailabilityFilter(filterVal);
          setCurrentPage(1);
        }}
      />

      {/* 3. Search & Filter Toolbar */}
      <VenueToolbar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={(val) => {
          setAvailabilityFilter(val);
          setCurrentPage(1);
        }}
        venueTypeFilter={venueTypeFilter}
        onVenueTypeChange={(val) => {
          setVenueTypeFilter(val);
          setCurrentPage(1);
        }}
        cityFilter={cityFilter}
        onCityChange={(val) => {
          setCityFilter(val);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredVenues.length}
      />

      {/* 4. Main Venue Display */}
      {venues.length === 0 ? (
        <NoVenuesState onAddVenue={handleOpenAddModal} />
      ) : filteredVenues.length === 0 ? (
        <NoSearchResultsState onClearFilters={handleClearFilters} />
      ) : (
        <div className="space-y-6">
          {viewMode === 'grid' ? (
            <VenueGrid
              venues={paginatedVenues}
              onViewDetails={(venue) => setSelectedDrawerVenue(venue)}
              onEdit={handleOpenEditModal}
              onDuplicate={handleDuplicateVenue}
              onToggleMaintenance={handleToggleMaintenance}
              onDeactivate={handleOpenDeactivateModal}
            />
          ) : (
            <VenueList
              venues={paginatedVenues}
              onViewDetails={(venue) => setSelectedDrawerVenue(venue)}
              onEdit={handleOpenEditModal}
              onDuplicate={handleDuplicateVenue}
              onToggleMaintenance={handleToggleMaintenance}
              onDeactivate={handleOpenDeactivateModal}
            />
          )}

          {/* 5. Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredVenues.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Add / Edit Venue Modal */}
      <VenueFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVenue}
        editVenue={editingVenue}
      />

      {/* Venue Details Drawer */}
      <VenueDetailsDrawer
        isOpen={Boolean(selectedDrawerVenue)}
        onClose={() => setSelectedDrawerVenue(null)}
        venue={selectedDrawerVenue}
        onEdit={(venue) => {
          setSelectedDrawerVenue(null);
          handleOpenEditModal(venue);
        }}
        onToggleMaintenance={handleToggleMaintenance}
        onDeactivate={handleOpenDeactivateModal}
      />

      {/* Safe Deactivate Venue Modal */}
      <DeactivateVenueModal
        isOpen={Boolean(deactivatingVenue)}
        onClose={() => setDeactivatingVenue(null)}
        venue={deactivatingVenue}
        onConfirmDeactivate={handleConfirmDeactivate}
        onConfirmActivate={handleConfirmActivate}
      />

      {/* Booking Conflict Alert Modal */}
      <VenueConflictAlert
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflictData={conflictData}
        onChooseAnother={() => setIsConflictModalOpen(false)}
        onViewBooking={() => {
          setIsConflictModalOpen(false);
          const icc = venues.find((v) => v.name.includes('Hyderabad International'));
          if (icc) setSelectedDrawerVenue(icc);
        }}
      />

      {/* Animated Feedback Toast */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Venues;
