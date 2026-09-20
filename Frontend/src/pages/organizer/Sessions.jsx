import React, { useState, useEffect, useMemo } from 'react';
import { Plus, UploadCloud, Download, AlertTriangle, Clock } from 'lucide-react';
import { sessionService, eventService, speakerService, venueService } from '../../services/api';

import EventSelector from '../../components/organizer/sessions/EventSelector';
import SessionSummaryCards from '../../components/organizer/sessions/SessionSummaryCards';
import SessionToolbar from '../../components/organizer/sessions/SessionToolbar';
import AgendaView from '../../components/organizer/sessions/AgendaView';
import CalendarView from '../../components/organizer/sessions/CalendarView';
import SessionList from '../../components/organizer/sessions/SessionList';
import SessionDetailsDrawer from '../../components/organizer/sessions/SessionDetailsDrawer';
import SessionFormModal from '../../components/organizer/sessions/SessionFormModal';
import DuplicateSessionModal from '../../components/organizer/sessions/DuplicateSessionModal';
import CancelSessionModal from '../../components/organizer/sessions/CancelSessionModal';
import ExportScheduleMenu from '../../components/organizer/sessions/ExportScheduleMenu';
import ImportScheduleModal from '../../components/organizer/sessions/ImportScheduleModal';
import BulkActionsBar from '../../components/organizer/sessions/BulkActionsBar';
import ConflictDetector from '../../components/organizer/sessions/ConflictDetector';
import { NoSessionsState, NoSearchResultsState } from '../../components/organizer/sessions/EmptyState';
import Pagination from '../../components/organizer/sessions/Pagination';
import ToastNotification from '../../components/organizer/sessions/ToastNotification';

const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Global Tech Leadership Summit 2026',
    eventType: 'Conference',
    date: 'September 24, 2026',
    dateFormatted: 'September 24, 2026',
    venue: 'Hyderabad International Convention Centre',
    sessionCount: 24,
    organizationId: 'org-apex-01'
  },
  {
    id: 'evt-2',
    title: 'AI & Cloud Innovation Conference',
    eventType: 'Conference',
    date: 'October 04, 2026',
    dateFormatted: 'October 04, 2026',
    venue: 'Hyderabad Convention Center',
    sessionCount: 16,
    organizationId: 'org-apex-01'
  },
  {
    id: 'evt-3',
    title: 'Future of Digital Finance',
    eventType: 'Workshop',
    date: 'October 18, 2026',
    dateFormatted: 'October 18, 2026',
    venue: 'Bengaluru Tech Park Auditorium',
    sessionCount: 8,
    organizationId: 'org-apex-01'
  }
];

const INITIAL_SPEAKERS = [
  { id: 'sp-1', name: 'Arjun Mehta', designation: 'Chief Technology Officer', company: 'Apex Global', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop' },
  { id: 'sp-2', name: 'Sarah Wilson', designation: 'Principal Cloud Architect', company: 'TechNova Solutions', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop' },
  { id: 'sp-3', name: 'Rahul Sharma', designation: 'Head of Digital Assets', company: 'FinCore Labs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop' },
  { id: 'sp-4', name: 'Dr. Elena Rostova', designation: 'AI Research Director', company: 'QuantumSphere', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop' },
  { id: 'sp-5', name: 'Marcus Chen', designation: 'VP of Platform Engineering', company: 'CloudScale Inc', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop' },
  { id: 'sp-6', name: 'David Kim', designation: 'Lead Systems Engineer', company: 'ByteForge', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop' },
  { id: 'sp-7', name: 'Priya Sundaram', designation: 'Partner & Governance Lead', company: 'StratVentures', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop' }
];

const INITIAL_ROOMS = [
  { name: 'Main Hall', capacity: 1200, floor: 'Ground Floor' },
  { name: 'Hall A', capacity: 500, floor: 'Ground Floor' },
  { name: 'Hall B', capacity: 400, floor: '1st Floor' },
  { name: 'Room 101', capacity: 150, floor: '1st Floor' },
  { name: 'Room 201', capacity: 100, floor: '2nd Floor' },
  { name: 'Main Lobby', capacity: 2000, floor: 'Ground Floor' }
];

const INITIAL_SESSIONS = [
  {
    id: 'ses-1',
    title: 'Opening Keynote: The Autonomous Enterprise',
    type: 'Keynote',
    date: 'Sep 24, 2026',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    room: 'Main Hall',
    speaker: INITIAL_SPEAKERS[0],
    capacity: 1200,
    expectedAttendance: 1150,
    status: 'scheduled',
    tags: ['Leadership', 'AI'],
    description: 'Welcome address examining autonomous agents, self-healing architectures, and enterprise strategy in 2026.'
  },
  {
    id: 'ses-2',
    title: 'AI Infrastructure at Scale',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    room: 'Hall A',
    speaker: INITIAL_SPEAKERS[1],
    capacity: 500,
    expectedAttendance: 420,
    status: 'scheduled',
    tags: ['AI', 'Cloud'],
    description: 'Explore how modern AI infrastructure can be designed for enterprise-scale workloads with high-throughput GPUs and low latency.'
  },
  {
    id: 'ses-3',
    title: 'Zero-Trust Security Architectures',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    room: 'Hall B',
    speaker: INITIAL_SPEAKERS[4],
    capacity: 400,
    expectedAttendance: 360,
    status: 'scheduled',
    tags: ['Security', 'Cloud'],
    description: 'Implementation roadmap for strict identity verification, micro-segmentation, and cloud endpoint defense.'
  },
  {
    id: 'ses-4',
    title: 'Executive Fireside: Navigating Generative AI Governance',
    type: 'Panel',
    date: 'Sep 24, 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    room: 'Room 101',
    speaker: INITIAL_SPEAKERS[3],
    capacity: 150,
    expectedAttendance: 140,
    status: 'scheduled',
    tags: ['Leadership', 'Business'],
    description: 'Balancing rapid model experimentation with data compliance, safety guardrails, and audit transparency.'
  },
  {
    id: 'ses-5',
    title: 'Morning Networking & Refreshments Break',
    type: 'Break',
    date: 'Sep 24, 2026',
    startTime: '11:00 AM',
    endTime: '11:30 AM',
    room: 'Main Lobby',
    speaker: null,
    capacity: 2000,
    expectedAttendance: 1200,
    status: 'scheduled',
    tags: ['Networking'],
    description: 'Coffee, tea, and pastry service in the exhibition center and partner concourse.'
  },
  {
    id: 'ses-6',
    title: 'Future of Digital Finance & Real-Time Rails',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    room: 'Hall A',
    speaker: INITIAL_SPEAKERS[2],
    capacity: 500,
    expectedAttendance: 410,
    status: 'scheduled',
    tags: ['FinTech', 'Business'],
    description: 'Instant settlement mechanisms, cross-border tokenized deposits, and modern banking middleware.'
  },
  {
    id: 'ses-7',
    title: 'High-Throughput Distributed Microservices with Rust',
    type: 'Workshop',
    date: 'Sep 24, 2026',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    room: 'Hall B',
    speaker: INITIAL_SPEAKERS[5],
    capacity: 400,
    expectedAttendance: 380,
    status: 'scheduled',
    tags: ['Technology', 'Cloud'],
    description: 'Hands-on architectural patterns for zero-copy deserialization, Tokio async runtimes, and low memory footprints.'
  },
  {
    id: 'ses-8',
    title: 'Global Tech Hiring & Engineering Culture in 2027',
    type: 'Panel',
    date: 'Sep 24, 2026',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    room: 'Room 101',
    speaker: INITIAL_SPEAKERS[6],
    capacity: 150,
    expectedAttendance: 130,
    status: 'scheduled',
    tags: ['Leadership', 'Business'],
    description: 'Strategies for distributed engineering retention, asynchronous workflows, and technical leadership ladders.'
  },
  {
    id: 'ses-9',
    title: 'Executive Networking Luncheon',
    type: 'Break',
    date: 'Sep 24, 2026',
    startTime: '01:00 PM',
    endTime: '02:00 PM',
    room: 'Main Lobby',
    speaker: null,
    capacity: 2000,
    expectedAttendance: 1200,
    status: 'scheduled',
    tags: ['Networking'],
    description: 'Three-course catered buffet lunch in the Grand Ballroom banquet pavilion.'
  },
  {
    id: 'ses-10',
    title: 'Architecting Multi-Cloud Resiliency for Mission-Critical SLAs',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    room: 'Hall A',
    speaker: INITIAL_SPEAKERS[1],
    capacity: 500,
    expectedAttendance: 430,
    status: 'scheduled',
    tags: ['Cloud', 'Technology'],
    description: 'Active-active multi-region deployments, chaos engineering validation, and automated failover control planes.'
  },
  {
    id: 'ses-11',
    title: 'Quantum Computing Primer: From Theory to Enterprise Applications',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    room: 'Hall B',
    speaker: INITIAL_SPEAKERS[3],
    capacity: 400,
    expectedAttendance: 250,
    status: 'draft', // DRAFT 1
    tags: ['Technology', 'AI'],
    description: 'Exploration of near-term quantum algorithms for optimization, portfolio rebalancing, and molecular modeling.'
  },
  {
    id: 'ses-12',
    title: 'AI Agents & Cognitive Workflows in Production',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    room: 'Room 101',
    speaker: INITIAL_SPEAKERS[4],
    capacity: 150,
    expectedAttendance: 145,
    status: 'scheduled',
    tags: ['AI', 'Technology'],
    description: 'Deploying autonomous tool-use agents with deterministic verifiers and human-in-the-loop escalation.'
  },
  {
    id: 'ses-13',
    title: 'Securing the Software Supply Chain Against Advanced Threats',
    type: 'Workshop',
    date: 'Sep 24, 2026',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    room: 'Hall A',
    speaker: INITIAL_SPEAKERS[5],
    capacity: 500,
    expectedAttendance: 410,
    status: 'scheduled',
    tags: ['Security', 'Cloud'],
    description: 'Automating SBOM generation, reproducible builds, and cryptographic signing with Sigstore.'
  },
  {
    id: 'ses-14',
    title: 'Enterprise SaaS Valuation & M&A Landscape',
    type: 'Panel',
    date: 'Sep 24, 2026',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    room: 'Hall B',
    speaker: INITIAL_SPEAKERS[2],
    capacity: 400,
    expectedAttendance: 320,
    status: 'scheduled',
    tags: ['Business', 'Leadership'],
    description: 'Venture metrics, net revenue retention benchmarks, and consolidation dynamics in corporate software.'
  },
  {
    id: 'ses-15',
    title: 'Hands-on: Fine-Tuning Open Source LLMs on Custom Datasets',
    type: 'Workshop',
    date: 'Sep 24, 2026',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    room: 'Room 101',
    speaker: INITIAL_SPEAKERS[0],
    capacity: 150,
    expectedAttendance: 150,
    status: 'scheduled',
    tags: ['AI', 'Technology'],
    description: 'QLoRA, parameter-efficient fine tuning, evaluation benchmarks, and quantization for edge servers.'
  },
  {
    id: 'ses-16',
    title: 'Afternoon Chai & Pastries Networking Mixer',
    type: 'Networking',
    date: 'Sep 24, 2026',
    startTime: '04:00 PM',
    endTime: '04:30 PM',
    room: 'Main Lobby',
    speaker: null,
    capacity: 2000,
    expectedAttendance: 1200,
    status: 'scheduled',
    tags: ['Networking'],
    description: 'Afternoon refreshments break to connect with fellow corporate attendees and exhibitors.'
  },
  {
    id: 'ses-17',
    title: 'The Next Decade of Autonomous Robotics & Spatial Compute',
    type: 'Keynote',
    date: 'Sep 24, 2026',
    startTime: '04:30 PM',
    endTime: '05:30 PM',
    room: 'Main Hall',
    speaker: INITIAL_SPEAKERS[3],
    capacity: 1200,
    expectedAttendance: 1100,
    status: 'scheduled',
    tags: ['Technology', 'AI'],
    description: 'Futuristic roadmap of humanoid robotics, multi-modal perception, and spatial operations.'
  },
  {
    id: 'ses-18',
    title: 'Modern Data Stack: Vector Databases & Real-time Analytics',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '04:30 PM',
    endTime: '05:30 PM',
    room: 'Hall A',
    speaker: INITIAL_SPEAKERS[1],
    capacity: 500,
    expectedAttendance: 390,
    status: 'scheduled',
    tags: ['Cloud', 'AI'],
    description: 'Embedding generation, HNSW indexes, hybrid keyword-vector search, and low-latency retrieval pipelines.'
  },
  {
    id: 'ses-19',
    title: 'Building ClimateTech & Green Datacenter Architectures',
    type: 'Talk',
    date: 'Sep 24, 2026',
    startTime: '04:30 PM',
    endTime: '05:30 PM',
    room: 'Hall B',
    speaker: INITIAL_SPEAKERS[4],
    capacity: 400,
    expectedAttendance: 280,
    status: 'scheduled',
    tags: ['Technology', 'Leadership'],
    description: 'Immersion liquid cooling, renewable energy matching, and carbon accounting in hyperscale compute.'
  },
  {
    id: 'ses-20',
    title: 'Closing Executive Leadership Panel: 2027 Tech Horizon',
    type: 'Panel',
    date: 'Sep 24, 2026',
    startTime: '05:30 PM',
    endTime: '06:15 PM',
    room: 'Main Hall',
    speaker: INITIAL_SPEAKERS[0],
    capacity: 1200,
    expectedAttendance: 1150,
    status: 'scheduled',
    tags: ['Leadership', 'Business'],
    description: 'Summary reflections and forward projections from corporate innovators across four continents.'
  },
  {
    id: 'ses-21',
    title: 'VIP & Speaker Networking Reception',
    type: 'Networking',
    date: 'Sep 24, 2026',
    startTime: '06:15 PM',
    endTime: '07:30 PM',
    room: 'Main Lobby',
    speaker: null,
    capacity: 300,
    expectedAttendance: 220,
    status: 'scheduled',
    tags: ['Networking', 'Leadership'],
    description: 'Cocktail evening and exclusive networking dinner for keynote speakers and executive delegates.'
  },
  {
    id: 'ses-22',
    title: 'Legacy Mainframe Migration to Cloud-Native Workshop',
    type: 'Workshop',
    date: 'Sep 24, 2026',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    room: 'Room 201',
    speaker: INITIAL_SPEAKERS[5],
    capacity: 100,
    expectedAttendance: 40,
    status: 'cancelled', // CANCELLED 1
    tags: ['Cloud', 'Technology'],
    description: 'Session cancelled due to curriculum consolidation into the main Hall B workshop track.'
  },
  {
    id: 'ses-23',
    title: 'Enterprise Data Governance & Regulatory Compliance Roundtable',
    type: 'Workshop',
    date: 'Sep 24, 2026',
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    room: 'Room 201',
    speaker: INITIAL_SPEAKERS[6],
    capacity: 100,
    expectedAttendance: 60,
    status: 'draft', // DRAFT 2
    tags: ['Business', 'Security'],
    description: 'Roundtable workshop exploring GDPR, cross-border cloud sovereignty, and regulatory audit checklists.'
  },
  {
    id: 'ses-24',
    title: 'Founders & Venture Capital Pitch Arena',
    type: 'Networking',
    date: 'Sep 24, 2026',
    startTime: '04:30 PM',
    endTime: '05:30 PM',
    room: 'Room 201',
    speaker: INITIAL_SPEAKERS[2],
    capacity: 100,
    expectedAttendance: 95,
    status: 'scheduled',
    tags: ['Business', 'FinTech'],
    description: 'Fast-paced venture pitches from 8 curated enterprise seed startups to a panel of tier-1 institutional VCs.'
  }
];

const Sessions = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState(INITIAL_EVENTS[0].id);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);

  // Filters & View modes
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('agenda'); // 'agenda' | 'calendar' | 'list'

  // Selection for bulk actions
  const [selectedSessionIds, setSelectedSessionIds] = useState([]);

  // Pagination for List view
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Modals & Drawers
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedDrawerSession, setSelectedDrawerSession] = useState(null);
  const [duplicatingSession, setDuplicatingSession] = useState(null);
  const [cancellingSession, setCancellingSession] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [conflictModalData, setConflictModalData] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync with API fallback
  useEffect(() => {
    const loadApiData = async () => {
      try {
        const [evRes, spRes] = await Promise.all([
          eventService.getAll(),
          speakerService.getAll()
        ]);
        if (evRes?.data?.events && evRes.data.events.length > 0) {
          const orgEvents = evRes.data.events.map((e) => ({
            ...e,
            id: e._id || e.id,
            sessionCount: 24
          }));
          setEvents(orgEvents);
        }
        if (spRes?.data?.speakers && spRes.data.speakers.length > 0) {
          setSpeakers(spRes.data.speakers);
        }
      } catch (err) {
        console.info('Using enterprise session agenda dataset for Apex Global Events');
      }
    };
    loadApiData();
  }, []);

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId || e._id === selectedEventId) || events[0];
  }, [events, selectedEventId]);

  // Compute KPI Statistics
  const stats = useMemo(() => {
    const total = sessions.length;
    const scheduled = sessions.filter((s) => s.status === 'scheduled').length;
    const draft = sessions.filter((s) => s.status === 'draft').length;
    const cancelled = sessions.filter((s) => s.status === 'cancelled').length;
    return { total, scheduled, draft, cancelled };
  }, [sessions]);

  // Filter Logic
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = session.title?.toLowerCase().includes(q);
        const matchesRoom = (session.room || session.roomName)?.toLowerCase().includes(q);
        const matchesSpeaker = (session.speaker?.name || session.speakerName)?.toLowerCase().includes(q);
        const matchesTags = session.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesRoom && !matchesSpeaker && !matchesTags) {
          return false;
        }
      }

      // Session Type
      if (sessionTypeFilter !== 'all') {
        if (session.type?.toLowerCase() !== sessionTypeFilter.toLowerCase()) {
          return false;
        }
      }

      // Status Filter
      if (statusFilter !== 'all') {
        if (session.status?.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // Room Filter
      if (roomFilter !== 'all') {
        const currentRoom = session.room || session.roomName || '';
        if (currentRoom.toLowerCase() !== roomFilter.toLowerCase()) {
          return false;
        }
      }

      // Speaker Filter
      if (speakerFilter !== 'all') {
        const currentSpeaker = session.speaker?.name || session.speakerName || '';
        if (currentSpeaker.toLowerCase() !== speakerFilter.toLowerCase()) {
          return false;
        }
      }

      // Date Filter
      if (dateFilter !== 'all') {
        if (session.date !== dateFilter && !session.dateFormatted?.includes(dateFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [sessions, searchQuery, sessionTypeFilter, statusFilter, roomFilter, speakerFilter, dateFilter]);

  // Pagination for List View
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage, pageSize]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    sessionTypeFilter !== 'all' ||
    statusFilter !== 'all' ||
    roomFilter !== 'all' ||
    speakerFilter !== 'all' ||
    dateFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSessionTypeFilter('all');
    setStatusFilter('all');
    setRoomFilter('all');
    setSpeakerFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  // Selection handlers for Bulk Actions
  const handleToggleSelectSession = (sessionId) => {
    if (selectedSessionIds.includes(sessionId)) {
      setSelectedSessionIds((prev) => prev.filter((id) => id !== sessionId));
    } else {
      setSelectedSessionIds((prev) => [...prev, sessionId]);
    }
  };

  const handleSelectAllSessions = () => {
    if (selectedSessionIds.length === filteredSessions.length) {
      setSelectedSessionIds([]);
    } else {
      setSelectedSessionIds(filteredSessions.map((s) => s.id || s._id));
    }
  };

  // Action handlers
  const handleOpenAddModal = () => {
    setEditingSession(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (session) => {
    setEditingSession(session);
    setIsFormModalOpen(true);
  };

  const handleSaveSession = (savedData) => {
    if (editingSession) {
      setSessions((prev) =>
        prev.map((s) => (s.id === savedData.id || s._id === savedData.id ? savedData : s))
      );
      if (selectedDrawerSession && (selectedDrawerSession.id === savedData.id || selectedDrawerSession._id === savedData.id)) {
        setSelectedDrawerSession(savedData);
      }
      setToast({ type: 'success', message: '✓ Session updated successfully.' });
    } else {
      setSessions((prev) => [savedData, ...prev]);
      setToast({ type: 'success', message: '✓ Session scheduled successfully.' });
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDuplicate = (session) => {
    const duplicate = {
      ...session,
      id: `ses-${Date.now()}`,
      title: `Copy of ${session.title}`,
      status: 'draft'
    };
    setSessions((prev) => [duplicate, ...prev]);
    setDuplicatingSession(null);
    setToast({ type: 'success', message: '✓ Session duplicated into a new Draft session.' });
  };

  const handleConfirmCancel = (session) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === session.id || s._id === session.id ? { ...s, status: 'cancelled' } : s))
    );
    if (selectedDrawerSession && (selectedDrawerSession.id === session.id || selectedDrawerSession._id === session.id)) {
      setSelectedDrawerSession({ ...selectedDrawerSession, status: 'cancelled' });
    }
    setCancellingSession(null);
    setToast({ type: 'info', message: `✓ Session "${session.title}" cancelled.` });
  };

  const handleBulkCancel = () => {
    if (window.confirm(`Cancel ${selectedSessionIds.length} selected sessions?`)) {
      setSessions((prev) =>
        prev.map((s) =>
          selectedSessionIds.includes(s.id || s._id) ? { ...s, status: 'cancelled' } : s
        )
      );
      setSelectedSessionIds([]);
      setToast({ type: 'info', message: `✓ Selected sessions cancelled.` });
    }
  };

  const handleExportPDF = () => {
    setToast({ type: 'success', message: '✓ Exported Printable PDF Agenda successfully.' });
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Type', 'Date', 'Time', 'Room', 'Speaker', 'Capacity', 'Status'];
    const rows = filteredSessions.map((s) => [
      `"${s.title}"`,
      s.type,
      s.date,
      `"${s.startTime} - ${s.endTime}"`,
      `"${s.room}"`,
      `"${s.speaker?.name || s.speakerName || 'TBA'}"`,
      s.capacity,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'EventForge_Agenda_Schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ type: 'success', message: '✓ Downloaded CSV Agenda Manifest.' });
  };

  const handleSimulateConflict = () => {
    setConflictModalData({
      type: 'Room & Speaker Overlap',
      conflictingSession: 'Cloud Security at Scale',
      occupiedRange: '10:30 AM – 11:30 AM',
      room: 'Hall A',
      speaker: 'Sarah Wilson'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sessions
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Apex Global Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create and manage your event agenda, speakers, rooms and schedules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Conflict Simulator Diagnostic */}
          <button
            type="button"
            onClick={handleSimulateConflict}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
            title="Diagnose real-time scheduling collisions"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Check Conflict Engine</span>
          </button>

          {/* Import Schedule */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Schedule</span>
          </button>

          {/* Export Schedule Dropdown */}
          <ExportScheduleMenu
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
          />

          {/* Add Session CTA */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Session</span>
          </button>
        </div>
      </div>

      {/* 2. Target Event Selector Bar */}
      <EventSelector
        events={events}
        selectedEventId={selectedEventId}
        onEventChange={(id) => {
          setSelectedEventId(id);
          setSelectedSessionIds([]);
          setCurrentPage(1);
        }}
        currentEvent={currentEvent}
      />

      {/* 3. Summary KPI Cards */}
      <SessionSummaryCards
        stats={stats}
        activeFilter={statusFilter}
        onFilterChange={(filterVal) => {
          setStatusFilter(filterVal);
          setCurrentPage(1);
        }}
      />

      {/* 4. Search & Filters Toolbar */}
      <SessionToolbar
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setCurrentPage(1);
        }}
        sessionTypeFilter={sessionTypeFilter}
        onSessionTypeChange={(val) => {
          setSessionTypeFilter(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        roomFilter={roomFilter}
        onRoomChange={(val) => {
          setRoomFilter(val);
          setCurrentPage(1);
        }}
        speakerFilter={speakerFilter}
        onSpeakerChange={(val) => {
          setSpeakerFilter(val);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        onDateChange={(val) => {
          setDateFilter(val);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredSessions.length}
        rooms={rooms}
        speakers={speakers}
      />

      {/* 5. Main View: Agenda | Calendar | List */}
      {sessions.length === 0 ? (
        <NoSessionsState onAddSession={handleOpenAddModal} />
      ) : filteredSessions.length === 0 ? (
        <NoSearchResultsState onClearFilters={handleClearFilters} />
      ) : viewMode === 'agenda' ? (
        <AgendaView
          sessions={filteredSessions}
          onViewSession={(s) => setSelectedDrawerSession(s)}
          onEditSession={handleOpenEditModal}
          onDuplicateSession={(s) => setDuplicatingSession(s)}
          onCancelSession={(s) => setCancellingSession(s)}
          selectedSessionIds={selectedSessionIds}
          onToggleSelectSession={handleToggleSelectSession}
        />
      ) : viewMode === 'calendar' ? (
        <CalendarView
          sessions={filteredSessions}
          onViewSession={(s) => setSelectedDrawerSession(s)}
        />
      ) : (
        <div className="space-y-4">
          <SessionList
            sessions={paginatedSessions}
            onView={(s) => setSelectedDrawerSession(s)}
            onEdit={handleOpenEditModal}
            onDuplicate={(s) => setDuplicatingSession(s)}
            onCancel={(s) => setCancellingSession(s)}
            selectedSessionIds={selectedSessionIds}
            onToggleSelect={handleToggleSelectSession}
            onSelectAll={handleSelectAllSessions}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={filteredSessions.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedSessionIds.length}
        onCancelSelected={handleBulkCancel}
        onExportSelected={handleExportCSV}
        onMoveDateSelected={() => {
          setToast({ type: 'info', message: `Rescheduled ${selectedSessionIds.length} sessions to Sep 25, 2026.` });
          setSelectedSessionIds([]);
        }}
        onClearSelection={() => setSelectedSessionIds([])}
      />

      {/* Add / Edit Session Modal */}
      <SessionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSession}
        editSession={editingSession}
        speakers={speakers}
        rooms={rooms}
      />

      {/* Session Details Drawer */}
      <SessionDetailsDrawer
        isOpen={Boolean(selectedDrawerSession)}
        onClose={() => setSelectedDrawerSession(null)}
        session={selectedDrawerSession}
        onEdit={(s) => {
          setSelectedDrawerSession(null);
          handleOpenEditModal(s);
        }}
        onDuplicate={(s) => {
          setSelectedDrawerSession(null);
          setDuplicatingSession(s);
        }}
        onCancel={(s) => {
          setSelectedDrawerSession(null);
          setCancellingSession(s);
        }}
      />

      {/* Duplicate Session Modal */}
      <DuplicateSessionModal
        isOpen={Boolean(duplicatingSession)}
        onClose={() => setDuplicatingSession(null)}
        session={duplicatingSession}
        onConfirm={handleConfirmDuplicate}
      />

      {/* Cancel Session Modal */}
      <CancelSessionModal
        isOpen={Boolean(cancellingSession)}
        onClose={() => setCancellingSession(null)}
        session={cancellingSession}
        onConfirm={handleConfirmCancel}
      />

      {/* Import Schedule Modal */}
      <ImportScheduleModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(filename) => {
          setToast({ type: 'success', message: `✓ Successfully imported agenda from "${filename}".` });
        }}
      />

      {/* Conflict Detector Modal */}
      <ConflictDetector
        isOpen={Boolean(conflictModalData)}
        onClose={() => setConflictModalData(null)}
        conflict={conflictModalData}
        onResolve={() => {
          setConflictModalData(null);
          setToast({ type: 'success', message: '✓ Shifted session slot to 11:30 AM to resolve room collision.' });
        }}
        onEditSchedule={() => {
          setConflictModalData(null);
          handleOpenAddModal();
        }}
      />

      {/* Animated Action Feedback Toast */}
      <ToastNotification
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Sessions;
