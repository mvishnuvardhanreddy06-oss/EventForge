import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, UploadCloud, Calendar, Sparkles } from 'lucide-react';
import { eventService } from '../../services/api';
import EventSummaryCards from '../../components/organizer/events/EventSummaryCards';
import EventToolbar from '../../components/organizer/events/EventToolbar';
import EventGrid from '../../components/organizer/events/EventGrid';
import EventList from '../../components/organizer/events/EventList';
import Pagination from '../../components/organizer/events/Pagination';
import DuplicateEventModal from '../../components/organizer/events/DuplicateEventModal';
import ArchiveEventModal from '../../components/organizer/events/ArchiveEventModal';
import DeleteDraftModal from '../../components/organizer/events/DeleteDraftModal';
import PublishValidationModal from '../../components/organizer/events/PublishValidationModal';
import ImportEventModal from '../../components/organizer/events/ImportEventModal';
import { NoEventsState, NoSearchResultsState } from '../../components/organizer/events/EmptyState';
import ToastNotification from '../../components/organizer/events/ToastNotification';

const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Global Tech Leadership Summit 2026',
    subtitle: 'Technology Conference & Executive Leadership',
    eventType: 'Conference',
    category: 'Technology',
    status: 'published',
    date: 'September 24, 2026',
    dateFormatted: 'Sep 24, 2026',
    time: '09:00 AM – 06:00 PM',
    timeFormatted: '09:00 AM – 06:00 PM',
    venue: 'Hyderabad International Convention Centre',
    location: 'Hyderabad',
    registrationsCount: 1240,
    capacity: 1500,
    capacityPercent: 82,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    createdAt: '2026-08-01',
    setupProgress: 100
  },
  {
    id: 'evt-2',
    title: 'AI & Cloud Innovation Conference',
    subtitle: 'NextGen Cloud Architectures & Generative AI',
    eventType: 'Conference',
    category: 'Cloud & AI',
    status: 'published',
    date: 'October 04, 2026',
    dateFormatted: 'Oct 04, 2026',
    time: '10:00 AM – 05:30 PM',
    timeFormatted: '10:00 AM – 05:30 PM',
    venue: 'Hyderabad Convention Center',
    location: 'Hyderabad',
    registrationsCount: 684,
    capacity: 1000,
    capacityPercent: 68,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
    createdAt: '2026-08-10',
    setupProgress: 100
  },
  {
    id: 'evt-3',
    title: 'Future of Digital Finance',
    subtitle: 'FinTech Transformation & Decentralized Rails',
    eventType: 'Workshop',
    category: 'FinTech',
    status: 'draft',
    date: 'October 18, 2026',
    dateFormatted: 'Oct 18, 2026',
    time: '09:30 AM – 04:30 PM',
    timeFormatted: '09:30 AM – 04:30 PM',
    venue: 'Bengaluru Tech Park Auditorium',
    location: 'Bengaluru',
    registrationsCount: 0,
    capacity: 500,
    capacityPercent: 0,
    setupProgress: 60,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop',
    createdAt: '2026-08-25'
  },
  {
    id: 'evt-4',
    title: 'Enterprise Leadership Forum 2026',
    subtitle: 'Executive Strategy & Global Organizational Governance',
    eventType: 'Corporate Meeting',
    category: 'Leadership',
    status: 'completed',
    date: 'August 15, 2026',
    dateFormatted: 'Aug 15, 2026',
    time: '09:00 AM – 05:00 PM',
    timeFormatted: '09:00 AM – 05:00 PM',
    venue: 'Hyderabad Novotel Grand Ballroom',
    location: 'Hyderabad',
    registrationsCount: 920,
    capacity: 920,
    capacityPercent: 100,
    revenue: '₹3,80,000',
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
    createdAt: '2026-07-01',
    setupProgress: 100
  },
  {
    id: 'evt-5',
    title: 'CyberSecurity Horizons 2026',
    subtitle: 'Zero Trust Architecture & Threat Mitigation',
    eventType: 'Conference',
    category: 'Cybersecurity',
    status: 'published',
    date: 'November 12, 2026',
    dateFormatted: 'Nov 12, 2026',
    time: '09:00 AM – 05:30 PM',
    timeFormatted: '09:00 AM – 05:30 PM',
    venue: 'Mumbai World Trade Centre',
    location: 'Mumbai',
    registrationsCount: 450,
    capacity: 600,
    capacityPercent: 75,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
    createdAt: '2026-08-15',
    setupProgress: 100
  },
  {
    id: 'evt-6',
    title: 'Developer Ecosystem Day',
    subtitle: 'Modern Tooling, Open Source & Distributed Systems',
    eventType: 'Workshop',
    category: 'Developer Tools',
    status: 'published',
    date: 'November 28, 2026',
    dateFormatted: 'Nov 28, 2026',
    time: '10:00 AM – 04:00 PM',
    timeFormatted: '10:00 AM – 04:00 PM',
    venue: 'Hyderabad IT Corridor Hub',
    location: 'Hyderabad',
    registrationsCount: 320,
    capacity: 400,
    capacityPercent: 80,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
    createdAt: '2026-08-18',
    setupProgress: 100
  },
  {
    id: 'evt-7',
    title: 'HealthTech Global Expo',
    subtitle: 'Biomedical Innovation & Clinical Informatics',
    eventType: 'Exhibition',
    category: 'Healthcare',
    status: 'published',
    date: 'December 05, 2026',
    dateFormatted: 'Dec 05, 2026',
    time: '09:00 AM – 06:00 PM',
    timeFormatted: '09:00 AM – 06:00 PM',
    venue: 'Pragati Maidan, New Delhi',
    location: 'New Delhi',
    registrationsCount: 1800,
    capacity: 2000,
    capacityPercent: 90,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    createdAt: '2026-08-20',
    setupProgress: 100
  },
  {
    id: 'evt-8',
    title: 'Clean Energy Innovation Forum',
    subtitle: 'Decarbonization, Solar & Renewable Microgrids',
    eventType: 'Seminar',
    category: 'Sustainability',
    status: 'published',
    date: 'December 15, 2026',
    dateFormatted: 'Dec 15, 2026',
    time: '10:30 AM – 04:30 PM',
    timeFormatted: '10:30 AM – 04:30 PM',
    venue: 'Hyderabad Green Tech Campus',
    location: 'Hyderabad',
    registrationsCount: 280,
    capacity: 350,
    capacityPercent: 80,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop',
    createdAt: '2026-08-22',
    setupProgress: 100
  },
  {
    id: 'evt-9',
    title: 'Agile Product Management Summit',
    subtitle: 'Continuous Discovery & User-Centric Roadmapping',
    eventType: 'Corporate Meeting',
    category: 'Agile & Product',
    status: 'published',
    date: 'January 10, 2027',
    dateFormatted: 'Jan 10, 2027',
    time: '09:30 AM – 05:00 PM',
    timeFormatted: '09:30 AM – 05:00 PM',
    venue: 'JW Marriott, Pune',
    location: 'Pune',
    registrationsCount: 150,
    capacity: 200,
    capacityPercent: 75,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
    createdAt: '2026-08-28',
    setupProgress: 100
  },
  {
    id: 'evt-10',
    title: 'Cloud Native Microservices Camp',
    subtitle: 'Kubernetes, Service Mesh & Distributed Observability',
    eventType: 'Workshop',
    category: 'Cloud Infrastructure',
    status: 'draft',
    date: 'January 24, 2027',
    dateFormatted: 'Jan 24, 2027',
    time: '10:00 AM – 04:00 PM',
    timeFormatted: '10:00 AM – 04:00 PM',
    venue: 'Hyderabad Tech Zone Hall C',
    location: 'Hyderabad',
    registrationsCount: 0,
    capacity: 250,
    capacityPercent: 0,
    setupProgress: 40,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
    createdAt: '2026-09-01'
  },
  {
    id: 'evt-11',
    title: 'SaaS Founders Roundtable',
    subtitle: 'Growth Metrics, Capital Efficiency & B2B Expansion',
    eventType: 'Networking',
    category: 'Executive Networking',
    status: 'draft',
    date: 'February 08, 2027',
    dateFormatted: 'Feb 08, 2027',
    time: '05:30 PM – 09:00 PM',
    timeFormatted: '05:30 PM – 09:00 PM',
    venue: 'Bengaluru Club Lounge',
    location: 'Bengaluru',
    registrationsCount: 0,
    capacity: 100,
    capacityPercent: 0,
    setupProgress: 20,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop',
    createdAt: '2026-09-05'
  },
  {
    id: 'evt-12',
    title: 'NextGen AI Robotics Symposium',
    subtitle: 'Autonomous Systems, Computer Vision & Edge AI',
    eventType: 'Conference',
    category: 'Robotics & AI',
    status: 'published',
    date: 'February 20, 2027',
    dateFormatted: 'Feb 20, 2027',
    time: '09:00 AM – 06:00 PM',
    timeFormatted: '09:00 AM – 06:00 PM',
    venue: 'Hyderabad International Convention Centre',
    location: 'Hyderabad',
    registrationsCount: 820,
    capacity: 1000,
    capacityPercent: 82,
    organization: 'Apex Global Events',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    createdAt: '2026-09-10',
    setupProgress: 100
  }
];

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [deleteDraftModalOpen, setDeleteDraftModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Background fetch to sync with API if available
  useEffect(() => {
    const syncEvents = async () => {
      try {
        const res = await eventService.getAll();
        if (res?.success && Array.isArray(res.data?.events) && res.data.events.length > 0) {
          // Merge API events into state while preserving the enterprise demo events
          const apiEvents = res.data.events.map((e) => ({
            id: e._id,
            title: e.title,
            subtitle: e.description?.slice(0, 60) || 'Corporate Summit',
            eventType: e.category || 'Conference',
            category: e.category || 'General',
            status: e.status || 'published',
            date: e.startDate ? new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
            dateFormatted: e.startDate ? new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
            timeFormatted: '09:00 AM – 06:00 PM',
            venue: e.venueId?.name || 'Hyderabad Convention Centre',
            location: e.venueId?.city || 'Hyderabad',
            registrationsCount: e.currentRegistrations || 0,
            capacity: e.capacity || 1000,
            capacityPercent: Math.min(100, Math.round(((e.currentRegistrations || 0) / (e.capacity || 1000)) * 100)),
            organization: 'Apex Global Events',
            coverImage: e.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
            createdAt: e.createdAt || new Date().toISOString()
          }));
          // Combine ensuring unique IDs
          const existingIds = new Set(apiEvents.map((a) => a.id));
          const filteredInit = INITIAL_EVENTS.filter((i) => !existingIds.has(i.id));
          setEvents([...apiEvents, ...filteredInit]);
        }
      } catch (err) {
        // Fallback gracefully to INITIAL_EVENTS
      }
    };
    syncEvents();
  }, []);

  // Compute live summary counts
  const summaryCounts = useMemo(() => {
    const total = events.length;
    const published = events.filter((e) => e.status === 'published' || e.status === 'ongoing').length;
    const draft = events.filter((e) => e.status === 'draft').length;
    const completed = events.filter((e) => e.status === 'completed').length;
    return { total, published, draft, completed };
  }, [events]);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((e) => (e.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    // Event Type filter
    if (eventTypeFilter && eventTypeFilter !== 'all') {
      result = result.filter(
        (e) => (e.eventType || '').toLowerCase() === eventTypeFilter.toLowerCase()
      );
    }

    // Date filter
    if (dateFilter && dateFilter !== 'all') {
      if (dateFilter === 'past') {
        result = result.filter((e) => e.status === 'completed');
      } else if (dateFilter === 'upcoming') {
        result = result.filter((e) => e.status === 'published' || e.status === 'draft');
      } else if (dateFilter === 'this_month') {
        result = result.filter((e) => (e.dateFormatted || '').includes('Sep'));
      } else if (dateFilter === 'this_week') {
        result = result.filter((e) => (e.dateFormatted || '').includes('Sep 24'));
      }
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => {
        const titleMatch = (e.title || '').toLowerCase().includes(q);
        const venueMatch = (e.venue || '').toLowerCase().includes(q);
        const typeMatch = (e.eventType || '').toLowerCase().includes(q);
        const orgMatch = (e.organization || '').toLowerCase().includes(q);
        return titleMatch || venueMatch || typeMatch || orgMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'oldest') {
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      }
      if (sortOrder === 'registrations') {
        return (b.registrationsCount || 0) - (a.registrationsCount || 0);
      }
      if (sortOrder === 'name') {
        return (a.title || '').localeCompare(b.title || '');
      }
      // default: newest
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return result;
  }, [events, statusFilter, eventTypeFilter, dateFilter, search, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, eventTypeFilter, dateFilter, sortOrder]);

  // Pagination slice
  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  // Handlers for Modals & Actions
  const handleOpenDuplicate = (event) => {
    setSelectedEvent(event);
    setDuplicateModalOpen(true);
  };

  const handleConfirmDuplicate = (event) => {
    const duplicatedEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      title: `Copy of ${event.title}`,
      status: 'draft',
      registrationsCount: 0,
      capacityPercent: 0,
      setupProgress: 50,
      createdAt: new Date().toISOString()
    };
    setEvents([duplicatedEvent, ...events]);
    setDuplicateModalOpen(false);
    setToastMessage('✓ Event duplicated successfully.');
  };

  const handleOpenArchive = (event) => {
    setSelectedEvent(event);
    setArchiveModalOpen(true);
  };

  const handleConfirmArchive = (event) => {
    // Remove from active list or mark archived
    setEvents(events.filter((e) => (e.id || e._id) !== (event.id || event._id)));
    setArchiveModalOpen(false);
    setToastMessage('✓ Event archived successfully.');
  };

  const handleOpenDeleteDraft = (event) => {
    setSelectedEvent(event);
    setDeleteDraftModalOpen(true);
  };

  const handleConfirmDeleteDraft = (event) => {
    setEvents(events.filter((e) => (e.id || e._id) !== (event.id || event._id)));
    setDeleteDraftModalOpen(false);
    setToastMessage('✓ Draft event deleted successfully.');
  };

  const handleOpenPublish = (event) => {
    setSelectedEvent(event);
    setPublishModalOpen(true);
  };

  const handleConfirmPublish = (event) => {
    setEvents(
      events.map((e) =>
        (e.id || e._id) === (event.id || event._id) ? { ...e, status: 'published', setupProgress: 100 } : e
      )
    );
    setPublishModalOpen(false);
    setToastMessage('✓ Event published successfully.');
  };

  const handleImportSuccess = () => {
    const importedSample = {
      id: `evt-${Date.now()}`,
      title: 'Global AI Product Showcase 2026',
      subtitle: 'Enterprise AI & Machine Learning Exhibition',
      eventType: 'Exhibition',
      category: 'AI & Data',
      status: 'published',
      date: 'Dec 18, 2026',
      dateFormatted: 'Dec 18, 2026',
      time: '10:00 AM – 06:00 PM',
      timeFormatted: '10:00 AM – 06:00 PM',
      venue: 'HICC Hyderabad',
      location: 'Hyderabad',
      registrationsCount: 350,
      capacity: 800,
      capacityPercent: 44,
      organization: 'Apex Global Events',
      coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
      createdAt: new Date().toISOString()
    };
    setEvents([importedSample, ...events]);
    setToastMessage('✓ 1 corporate event imported successfully from manifest.');
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setEventTypeFilter('all');
    setDateFilter('all');
    setSortOrder('newest');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-x-hidden min-w-0">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
            My Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Create, manage and monitor all events belonging to your organization.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Event</span>
          </button>

          <Link
            to="/organizer/events/create"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Event</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 Summary Statistics Cards */}
      <EventSummaryCards
        counts={summaryCounts}
        activeStatusFilter={statusFilter}
        onSelectFilter={(newStatus) => setStatusFilter(newStatus)}
      />

      {/* 3. Search and Filter Toolbar */}
      <EventToolbar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        eventType={eventTypeFilter}
        onEventTypeChange={setEventTypeFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        sort={sortOrder}
        onSortChange={setSortOrder}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        totalCount={filteredEvents.length}
      />

      {/* 4. Events Presentation (Grid / List / Empty State) */}
      {events.length === 0 ? (
        <NoEventsState />
      ) : filteredEvents.length === 0 ? (
        <NoSearchResultsState onReset={handleResetFilters} />
      ) : viewMode === 'grid' ? (
        <div className="space-y-6">
          <EventGrid
            events={paginatedEvents}
            onDuplicate={handleOpenDuplicate}
            onArchive={handleOpenArchive}
            onDeleteDraft={handleOpenDeleteDraft}
            onPublish={handleOpenPublish}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEvents.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <EventList
            events={paginatedEvents}
            onDuplicate={handleOpenDuplicate}
            onArchive={handleOpenArchive}
            onDeleteDraft={handleOpenDeleteDraft}
            onPublish={handleOpenPublish}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEvents.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 5. Floating / Quick Create Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          to="/organizer/events/create"
          className="inline-flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all group font-bold text-xs"
          title="Create New Corporate Event"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="hidden sm:inline">Create Event</span>
        </Link>
      </div>

      {/* 6. Lifecycle Modals */}
      <DuplicateEventModal
        isOpen={duplicateModalOpen}
        event={selectedEvent}
        onClose={() => setDuplicateModalOpen(false)}
        onConfirm={handleConfirmDuplicate}
      />

      <ArchiveEventModal
        isOpen={archiveModalOpen}
        event={selectedEvent}
        onClose={() => setArchiveModalOpen(false)}
        onConfirm={handleConfirmArchive}
      />

      <DeleteDraftModal
        isOpen={deleteDraftModalOpen}
        event={selectedEvent}
        onClose={() => setDeleteDraftModalOpen(false)}
        onConfirm={handleConfirmDeleteDraft}
      />

      <PublishValidationModal
        isOpen={publishModalOpen}
        event={selectedEvent}
        onClose={() => setPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
      />

      <ImportEventModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* 7. Toast Notification */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default Events;
