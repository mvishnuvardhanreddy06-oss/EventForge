import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { registrationService, eventService, attendanceService } from '../../services/api';
import AttendeeSummaryCards from '../../components/organizer/attendees/AttendeeSummaryCards';
import AttendeeAnalyticsPreview from '../../components/organizer/attendees/AttendeeAnalyticsPreview';
import AttendeeToolbar from '../../components/organizer/attendees/AttendeeToolbar';
import AttendeeTable from '../../components/organizer/attendees/AttendeeTable';
import AttendeeCard from '../../components/organizer/attendees/AttendeeCard';
import AttendeeDetailsDrawer from '../../components/organizer/attendees/AttendeeDetailsDrawer';
import AttendeeFormModal from '../../components/organizer/attendees/AttendeeFormModal';
import EditAttendeeModal from '../../components/organizer/attendees/EditAttendeeModal';
import RegistrationApprovalModal from '../../components/organizer/attendees/RegistrationApprovalModal';
import RejectRegistrationModal from '../../components/organizer/attendees/RejectRegistrationModal';
import CheckInModal from '../../components/organizer/attendees/CheckInModal';
import ChangeTicketModal from '../../components/organizer/attendees/ChangeTicketModal';
import CancelRegistrationModal from '../../components/organizer/attendees/CancelRegistrationModal';
import CommunicationModal from '../../components/organizer/attendees/CommunicationModal';
import ImportAttendeesModal from '../../components/organizer/attendees/ImportAttendeesModal';
import WaitlistManagerModal from '../../components/organizer/attendees/WaitlistManagerModal';
import ExportMenu from '../../components/organizer/attendees/ExportMenu';
import Pagination from '../../components/organizer/attendees/Pagination';
import EmptyState from '../../components/organizer/attendees/EmptyState';
import ToastNotification from '../../components/organizer/attendees/ToastNotification';
import Loader from '../../components/Loader';
import { formatIndianPhone } from '../../utils/phoneUtils';

const MOCK_EVENTS = [
  { _id: 'evt-1', title: 'Global Tech Leadership Summit 2026' },
  { _id: 'evt-2', title: 'AI & Cloud Innovation Conference' },
  { _id: 'evt-3', title: 'FinTech Future Forum' }
];

const INITIAL_ATTENDEES = [
  {
    _id: 'att-101',
    organizationId: 'org-apex',
    eventId: 'evt-1',
    eventTitle: 'Global Tech Leadership Summit 2026',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '+919876543210',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    company: 'TechNova Technologies',
    designation: 'Senior Product Manager',
    city: 'Bengaluru',
    country: 'India',
    ticketType: 'VIP',
    ticketId: 'EVF-VIP-002481',
    registrationId: 'REG-2026-002481',
    registrationStatus: 'confirmed',
    paymentStatus: 'paid',
    amountPaid: 4999,
    dietaryPreference: 'Vegetarian',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-12T09:30:00Z',
    registeredAtFormatted: 'Sep 12, 2026',
    checkedIn: true,
    checkInTime: '08:42 AM',
    checkInDate: 'Sep 24, 2026',
    checkedInBy: 'Gate Staff 1',
    interests: 'AI Ethics, Product Strategy, Cloud Governance',
    notes: 'Keynote panel attendee'
  },
  {
    _id: 'att-102',
    organizationId: 'org-apex',
    eventId: 'evt-1',
    eventTitle: 'Global Tech Leadership Summit 2026',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@cloudsystems.in',
    phone: '+919812345678',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    company: 'CloudSystems India',
    designation: 'Principal Solutions Architect',
    city: 'Hyderabad',
    country: 'India',
    ticketType: 'Standard',
    ticketId: 'EVF-STD-002482',
    registrationId: 'REG-2026-002482',
    registrationStatus: 'confirmed',
    paymentStatus: 'paid',
    amountPaid: 2999,
    dietaryPreference: 'Standard / No Restrictions',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-13T11:20:00Z',
    registeredAtFormatted: 'Sep 13, 2026',
    checkedIn: false,
    checkInTime: null,
    checkInDate: null,
    checkedInBy: null,
    interests: 'Distributed Systems, Kubernetes, Service Mesh'
  },
  {
    _id: 'att-103',
    organizationId: 'org-apex',
    eventId: 'evt-1',
    eventTitle: 'Global Tech Leadership Summit 2026',
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'aarav.patel@finscale.org',
    phone: '+919898765432',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    company: 'FinScale Innovations',
    designation: 'VP of Product Engineering',
    city: 'Mumbai',
    country: 'India',
    ticketType: 'Corporate',
    ticketId: 'EVF-CRP-002483',
    registrationId: 'REG-2026-002483',
    registrationStatus: 'pending',
    paymentStatus: 'pending',
    amountPaid: 7999,
    dietaryPreference: 'Jain Vegetarian',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-18T14:45:00Z',
    registeredAtFormatted: 'Sep 18, 2026',
    checkedIn: false,
    checkInTime: null,
    checkInDate: null,
    checkedInBy: null,
    notes: 'Corporate delegation lead'
  },
  {
    _id: 'att-104',
    organizationId: 'org-apex',
    eventId: 'evt-1',
    eventTitle: 'Global Tech Leadership Summit 2026',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@datadrive.ai',
    phone: '+919845012345',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop',
    company: 'DataDrive AI',
    designation: 'Head of Machine Learning',
    city: 'Chennai',
    country: 'India',
    ticketType: 'VIP',
    ticketId: 'EVF-VIP-002484',
    registrationId: 'REG-2026-002484',
    registrationStatus: 'confirmed',
    paymentStatus: 'paid',
    amountPaid: 4999,
    dietaryPreference: 'Vegan',
    accessibilityRequirements: 'Wheelchair access',
    registeredAt: '2026-09-14T10:15:00Z',
    registeredAtFormatted: 'Sep 14, 2026',
    checkedIn: true,
    checkInTime: '09:05 AM',
    checkInDate: 'Sep 24, 2026',
    checkedInBy: 'Gate Staff 2',
    interests: 'Large Language Models, MLOps'
  },
  {
    _id: 'att-105',
    organizationId: 'org-apex',
    eventId: 'evt-1',
    eventTitle: 'Global Tech Leadership Summit 2026',
    firstName: 'Karan',
    lastName: 'Mehta',
    email: 'karan.mehta@nexgen.io',
    phone: '+919823456789',
    profileImage: null,
    company: 'NexGen Digital',
    designation: 'Security Researcher',
    city: 'Pune',
    country: 'India',
    ticketType: 'Early Bird',
    ticketId: 'EVF-EBD-002485',
    registrationId: 'REG-2026-002485',
    registrationStatus: 'waitlisted',
    waitlistPosition: 12,
    paymentStatus: 'pending',
    amountPaid: 1999,
    dietaryPreference: 'Standard / No Restrictions',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-19T16:10:00Z',
    registeredAtFormatted: 'Sep 19, 2026',
    checkedIn: false,
    checkInTime: null,
    checkInDate: null,
    checkedInBy: null
  },
  {
    _id: 'att-106',
    organizationId: 'org-apex',
    eventId: 'evt-2',
    eventTitle: 'AI & Cloud Innovation Conference',
    firstName: 'Divya',
    lastName: 'Ranganathan',
    email: 'divya.r@quantumai.tech',
    phone: '+919834567890',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    company: 'QuantumAI Labs',
    designation: 'Staff AI Engineer',
    city: 'Bengaluru',
    country: 'India',
    ticketType: 'VIP',
    ticketId: 'EVF-VIP-002486',
    registrationId: 'REG-2026-002486',
    registrationStatus: 'confirmed',
    paymentStatus: 'paid',
    amountPaid: 4999,
    dietaryPreference: 'Vegetarian',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-15T08:00:00Z',
    registeredAtFormatted: 'Sep 15, 2026',
    checkedIn: true,
    checkInTime: '08:15 AM',
    checkInDate: 'Sep 24, 2026',
    checkedInBy: 'Gate Staff 1'
  },
  {
    _id: 'att-107',
    organizationId: 'org-apex',
    eventId: 'evt-3',
    eventTitle: 'FinTech Future Forum',
    firstName: 'Siddharth',
    lastName: 'Kapoor',
    email: 'siddharth@payvault.in',
    phone: '+919867012345',
    profileImage: null,
    company: 'PayVault Payments',
    designation: 'Chief Compliance Officer',
    city: 'New Delhi',
    country: 'India',
    ticketType: 'Corporate',
    ticketId: 'EVF-CRP-002487',
    registrationId: 'REG-2026-002487',
    registrationStatus: 'rejected',
    paymentStatus: 'refunded',
    amountPaid: 7999,
    dietaryPreference: 'Standard / No Restrictions',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-10T12:00:00Z',
    registeredAtFormatted: 'Sep 10, 2026',
    checkedIn: false,
    checkInTime: null,
    checkInDate: null,
    checkedInBy: null,
    notes: 'Rejection reason: Corporate domain verification failure'
  },
  {
    _id: 'att-108',
    organizationId: 'org-apex',
    eventId: 'evt-1',
    eventTitle: 'Global Tech Leadership Summit 2026',
    firstName: 'Meera',
    lastName: 'Iyer',
    email: 'meera.iyer@uni-edu.ac.in',
    phone: '+919876098765',
    profileImage: null,
    company: 'Indian Institute of Science',
    designation: 'Research Scholar',
    city: 'Bengaluru',
    country: 'India',
    ticketType: 'Student',
    ticketId: 'EVF-STU-002488',
    registrationId: 'REG-2026-002488',
    registrationStatus: 'confirmed',
    paymentStatus: 'paid',
    amountPaid: 999,
    dietaryPreference: 'Vegetarian',
    accessibilityRequirements: 'None',
    registeredAt: '2026-09-16T15:20:00Z',
    registeredAtFormatted: 'Sep 16, 2026',
    checkedIn: false,
    checkInTime: null,
    checkInDate: null,
    checkedInBy: null
  }
];

const Attendees = () => {
  const [attendees, setAttendees] = useState(INITIAL_ATTENDEES);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    registrationStatus: 'all',
    ticketType: 'all',
    paymentStatus: 'all',
    checkInStatus: 'all',
    eventId: 'all',
    dateRegistered: 'all'
  });

  // Table & View States
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modals & Drawer State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [inspectingAttendee, setInspectingAttendee] = useState(null);
  const [editingAttendee, setEditingAttendee] = useState(null);
  const [approvingAttendee, setApprovingAttendee] = useState(null);
  const [rejectingAttendee, setRejectingAttendee] = useState(null);
  const [checkInModalData, setCheckInModalData] = useState({ isOpen: false, attendee: null, isUndo: false });
  const [changingTicketAttendee, setChangingTicketAttendee] = useState(null);
  const [cancellingAttendee, setCancellingAttendee] = useState(null);
  const [waitlistModalData, setWaitlistModalData] = useState({ isOpen: false, attendee: null });
  const [commModalData, setCommModalData] = useState({ isOpen: false, recipientsCount: 0, channel: 'email' });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync selectedEventId with filters
  const handleEventSelectorChange = (e) => {
    const val = e.target.value;
    setSelectedEventId(val);
    setFilters((prev) => ({ ...prev, eventId: val }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'eventId') setSelectedEventId(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      registrationStatus: 'all',
      ticketType: 'all',
      paymentStatus: 'all',
      checkInStatus: 'all',
      eventId: 'all',
      dateRegistered: 'all'
    });
    setSelectedEventId('all');
    setCurrentPage(1);
  };

  // Filtered dataset
  const filteredAttendees = useMemo(() => {
    return attendees.filter((att) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${att.firstName} ${att.lastName}`.toLowerCase();
        const email = (att.email || '').toLowerCase();
        const phone = (att.phone || '').toLowerCase();
        const ticketId = (att.ticketId || '').toLowerCase();
        const regId = (att.registrationId || '').toLowerCase();
        const comp = (att.company || '').toLowerCase();

        const matches =
          fullName.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          ticketId.includes(q) ||
          regId.includes(q) ||
          comp.includes(q);

        if (!matches) return false;
      }

      // Event
      if (filters.eventId !== 'all' && att.eventId !== filters.eventId) {
        return false;
      }

      // Registration Status
      if (filters.registrationStatus !== 'all' && att.registrationStatus !== filters.registrationStatus) {
        return false;
      }

      // Ticket Type
      if (filters.ticketType !== 'all' && att.ticketType !== filters.ticketType) {
        return false;
      }

      // Payment Status
      if (filters.paymentStatus !== 'all' && att.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Check-in Status
      if (filters.checkInStatus !== 'all') {
        if (filters.checkInStatus === 'checked_in' && !att.checkedIn) return false;
        if (filters.checkInStatus === 'not_checked_in' && att.checkedIn) return false;
      }

      return true;
    });
  }, [attendees, searchQuery, filters]);

  // Paginated dataset
  const totalItems = filteredAttendees.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedAttendees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAttendees.slice(start, start + pageSize);
  }, [filteredAttendees, currentPage, pageSize]);

  // Statistics calculation for 5 Summary Cards
  const stats = useMemo(() => {
    const total = 1240;
    const confirmed = 1180;
    const pending = 35;
    const checkedIn = 860;
    const paymentsPending = 125000;

    return {
      total,
      confirmed,
      pending,
      checkedIn,
      paymentsPending,
      paymentsPendingFormatted: '₹1,25,000'
    };
  }, []);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedAttendees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedAttendees.map((a) => a._id));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleAddAttendee = (newAtt) => {
    setAttendees((prev) => [newAtt, ...prev]);
    showToast(`✓ Registered attendee: ${newAtt.firstName} ${newAtt.lastName}`);
  };

  const handleEditAttendee = (updatedAtt) => {
    setAttendees((prev) =>
      prev.map((a) => (a._id === updatedAtt._id ? updatedAtt : a))
    );
    if (inspectingAttendee?._id === updatedAtt._id) {
      setInspectingAttendee(updatedAtt);
    }
    showToast('✓ Attendee updated successfully.');
  };

  const handleApproveRegistration = (att) => {
    const updated = {
      ...att,
      registrationStatus: 'confirmed'
    };
    setAttendees((prev) =>
      prev.map((a) => (a._id === att._id ? updated : a))
    );
    if (inspectingAttendee?._id === att._id) {
      setInspectingAttendee(updated);
    }
    showToast(`✓ Registration approved for ${att.firstName} ${att.lastName}.`);
  };

  const handleRejectRegistration = (att, reason) => {
    const updated = {
      ...att,
      registrationStatus: 'rejected',
      notes: reason ? `Rejected: ${reason}` : att.notes
    };
    setAttendees((prev) =>
      prev.map((a) => (a._id === att._id ? updated : a))
    );
    if (inspectingAttendee?._id === att._id) {
      setInspectingAttendee(updated);
    }
    showToast(`✓ Registration rejected for ${att.firstName} ${att.lastName}.`, 'error');
  };

  const handleConfirmCheckIn = (att, isUndo) => {
    const updated = isUndo
      ? {
          ...att,
          checkedIn: false,
          checkInTime: null,
          checkInDate: null,
          checkedInBy: null
        }
      : {
          ...att,
          checkedIn: true,
          checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          checkInDate: 'Sep 24, 2026',
          checkedInBy: 'Vishnureddy (Organizer)'
        };

    setAttendees((prev) =>
      prev.map((a) => (a._id === att._id ? updated : a))
    );
    if (inspectingAttendee?._id === att._id) {
      setInspectingAttendee(updated);
    }
    showToast(isUndo ? '✓ Check-in reverted.' : `✓ ${att.firstName} ${att.lastName} checked in successfully.`);
  };

  const handleChangeTicket = (att, newTierType, priceDiff) => {
    const updated = {
      ...att,
      ticketType: newTierType,
      ticketId: `EVF-${newTierType.substring(0, 3).toUpperCase()}-${att.ticketId.split('-')[2] || '002481'}`
    };
    setAttendees((prev) =>
      prev.map((a) => (a._id === att._id ? updated : a))
    );
    if (inspectingAttendee?._id === att._id) {
      setInspectingAttendee(updated);
    }
    showToast(`✓ Ticket tier changed to ${newTierType}. Payment adjustment advisory noted.`);
  };

  const handleCancelRegistration = (att, reason, refundNote) => {
    const updated = {
      ...att,
      registrationStatus: 'cancelled',
      notes: reason ? `Cancelled: ${reason}` : att.notes
    };
    setAttendees((prev) =>
      prev.map((a) => (a._id === att._id ? updated : a))
    );
    if (inspectingAttendee?._id === att._id) {
      setInspectingAttendee(updated);
    }
    showToast(`✓ Registration cancelled for ${att.firstName} ${att.lastName}.`);
  };

  const handlePromoteWaitlist = (att) => {
    const updated = {
      ...att,
      registrationStatus: 'confirmed',
      waitlistPosition: null
    };
    setAttendees((prev) =>
      prev.map((a) => (a._id === att._id ? updated : a))
    );
    if (inspectingAttendee?._id === att._id) {
      setInspectingAttendee(updated);
    }
    showToast(`✓ Promoted ${att.firstName} ${att.lastName} from waitlist to Confirmed.`);
  };

  const handleImportValidRecords = (imported) => {
    setAttendees((prev) => [...imported, ...prev]);
    showToast(`✓ Successfully imported ${imported.length} attendee records.`);
  };

  const handleBulkAction = (actionType) => {
    if (selectedIds.length === 0) return;

    if (actionType === 'email' || actionType === 'notification') {
      setCommModalData({
        isOpen: true,
        recipientsCount: selectedIds.length,
        channel: actionType === 'notification' ? 'notification' : 'email'
      });
      return;
    }

    if (actionType === 'export') {
      handleExport('csv', true);
      return;
    }

    if (actionType === 'checkIn') {
      if (window.confirm(`Mark all ${selectedIds.length} selected attendees as Checked In?`)) {
        setAttendees((prev) =>
          prev.map((a) =>
            selectedIds.includes(a._id)
              ? {
                  ...a,
                  checkedIn: true,
                  checkInTime: '09:00 AM',
                  checkInDate: 'Sep 24, 2026',
                  checkedInBy: 'Vishnureddy (Organizer)'
                }
              : a
          )
        );
        showToast(`✓ Marked ${selectedIds.length} attendees as checked in.`);
        setSelectedIds([]);
      }
      return;
    }

    if (actionType === 'cancel') {
      if (window.confirm(`Cancel registration for ${selectedIds.length} selected attendees? This will revoke access.`)) {
        setAttendees((prev) =>
          prev.map((a) =>
            selectedIds.includes(a._id) ? { ...a, registrationStatus: 'cancelled' } : a
          )
        );
        showToast(`✓ Cancelled ${selectedIds.length} registrations.`, 'error');
        setSelectedIds([]);
      }
      return;
    }

    if (actionType === 'changeTicket') {
      const targetAtt = attendees.find((a) => a._id === selectedIds[0]);
      if (targetAtt) setChangingTicketAttendee(targetAtt);
    }
  };

  const handleSendCommunication = ({ subject, channel, recipientsCount }) => {
    showToast(`✓ Message queued successfully to ${recipientsCount} attendees via ${channel}.`);
    setSelectedIds([]);
  };

  const handleExport = (format, onlySelected = false) => {
    const exportData = onlySelected
      ? attendees.filter((a) => selectedIds.includes(a._id))
      : filteredAttendees;

    const headers = [
      'Registration ID',
      'Ticket ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Designation',
      'City',
      'Country',
      'Ticket Type',
      'Registration Status',
      'Payment Status',
      'Amount Paid (INR)',
      'Checked In',
      'Check-in Time',
      'Check-in Date',
      'Event'
    ];

    const rows = exportData.map((a) => [
      a.registrationId,
      a.ticketId,
      `"${a.firstName}"`,
      `"${a.lastName}"`,
      `"${a.email}"`,
      `"${formatIndianPhone(a.phone)}"`,
      `"${a.company || ''}"`,
      `"${a.designation || ''}"`,
      `"${a.city || ''}"`,
      `"${a.country || ''}"`,
      `"${a.ticketType}"`,
      `"${a.registrationStatus}"`,
      `"${a.paymentStatus}"`,
      a.amountPaid,
      a.checkedIn ? 'Yes' : 'No',
      `"${a.checkInTime || ''}"`,
      `"${a.checkInDate || ''}"`,
      `"${a.eventTitle || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendees_export_${Date.now()}.${format === 'excel' ? 'xls' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`✓ Exported ${exportData.length} records as ${format.toUpperCase()}.`);
  };

  if (loading) return <Loader text="Loading attendee directory..." />;

  const isSearchZero = filteredAttendees.length === 0 && (searchQuery.trim() !== '' || filters.registrationStatus !== 'all');
  const isTotalZero = attendees.length === 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 2. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="text-blue-600">Apex Global Events</span>
            <span>•</span>
            <span>Organizer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Attendees
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage registrations, tickets, attendance and attendee communication.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <ExportMenu
            onExport={(format) => handleExport(format, false)}
            selectedCount={selectedIds.length}
          />

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Attendees</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Attendee</span>
          </button>
        </div>
      </div>

      {/* 3. EVENT SELECTOR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope</span>
            <span className="text-xs font-bold text-slate-800">Event:</span>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <select
            value={selectedEventId}
            onChange={handleEventSelectorChange}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
          >
            <option value="all">All Events</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. SUMMARY CARDS (5 Cards) */}
      <AttendeeSummaryCards
        stats={stats}
        activeFilter={filters.registrationStatus}
        onFilterChange={handleFilterChange}
      />

      {/* 31. ATTENDEE ANALYTICS PREVIEW */}
      <AttendeeAnalyticsPreview
        registrationRate={82}
        paymentCompletion={91}
        checkInRate={69}
        cancellationRate={4}
      />

      {/* 5. SEARCH & FILTER TOOLBAR */}
      <AttendeeToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        events={events}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalMatches={filteredAttendees.length}
      />

      {/* 7. ATTENDEE TABLE OR CARDS VIEW */}
      {isTotalZero ? (
        <EmptyState
          isSearch={false}
          onAddAttendee={() => setShowAddModal(true)}
          onImportAttendees={() => setShowImportModal(true)}
        />
      ) : isSearchZero ? (
        <EmptyState
          isSearch={true}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <>
          {viewMode === 'table' ? (
            <AttendeeTable
              attendees={paginatedAttendees}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onManage={(att) => setInspectingAttendee(att)}
              onApprove={(att) => setApprovingAttendee(att)}
              onReject={(att) => setRejectingAttendee(att)}
              onCheckIn={(att) => setCheckInModalData({ isOpen: true, attendee: att, isUndo: false })}
              onUndoCheckIn={(att) => setCheckInModalData({ isOpen: true, attendee: att, isUndo: true })}
              onChangeTicket={(att) => setChangingTicketAttendee(att)}
              onCancelRegistration={(att) => setCancellingAttendee(att)}
              onPromoteWaitlist={(att) => setWaitlistModalData({ isOpen: true, attendee: att })}
              onBulkAction={handleBulkAction}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAttendees.map((att) => (
                <AttendeeCard
                  key={att._id}
                  attendee={att}
                  isSelected={selectedIds.includes(att._id)}
                  onSelect={handleSelectOne}
                  onManage={(a) => setInspectingAttendee(a)}
                  onQuickAction={handleBulkAction}
                />
              ))}
            </div>
          )}

          {/* 27. PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {/* 14. ATTENDEE DETAILS DRAWER */}
      <AttendeeDetailsDrawer
        isOpen={Boolean(inspectingAttendee)}
        onClose={() => setInspectingAttendee(null)}
        attendee={inspectingAttendee}
        onEdit={(att) => setEditingAttendee(att)}
        onCheckIn={(att) => setCheckInModalData({ isOpen: true, attendee: att, isUndo: false })}
        onUndoCheckIn={(att) => setCheckInModalData({ isOpen: true, attendee: att, isUndo: true })}
        onChangeTicket={(att) => setChangingTicketAttendee(att)}
        onCancelRegistration={(att) => setCancellingAttendee(att)}
        onApprove={(att) => setApprovingAttendee(att)}
        onReject={(att) => setRejectingAttendee(att)}
      />

      {/* 15. ADD ATTENDEE MODAL */}
      <AttendeeFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAttendee}
        events={events}
      />

      {/* 16. EDIT ATTENDEE MODAL */}
      <EditAttendeeModal
        isOpen={Boolean(editingAttendee)}
        onClose={() => setEditingAttendee(null)}
        attendee={editingAttendee}
        onSave={handleEditAttendee}
      />

      {/* 17. APPROVE REGISTRATION MODAL */}
      <RegistrationApprovalModal
        isOpen={Boolean(approvingAttendee)}
        onClose={() => setApprovingAttendee(null)}
        attendee={approvingAttendee}
        onConfirm={handleApproveRegistration}
      />

      {/* 18. REJECT REGISTRATION MODAL */}
      <RejectRegistrationModal
        isOpen={Boolean(rejectingAttendee)}
        onClose={() => setRejectingAttendee(null)}
        attendee={rejectingAttendee}
        onConfirm={handleRejectRegistration}
      />

      {/* 20 & 21. CHECK-IN / UNDO CHECK-IN MODAL */}
      <CheckInModal
        isOpen={checkInModalData.isOpen}
        onClose={() => setCheckInModalData({ isOpen: false, attendee: null, isUndo: false })}
        attendee={checkInModalData.attendee}
        isUndo={checkInModalData.isUndo}
        onConfirm={handleConfirmCheckIn}
      />

      {/* 22. CHANGE TICKET MODAL */}
      <ChangeTicketModal
        isOpen={Boolean(changingTicketAttendee)}
        onClose={() => setChangingTicketAttendee(null)}
        attendee={changingTicketAttendee}
        onConfirm={handleChangeTicket}
      />

      {/* 23. CANCEL REGISTRATION MODAL */}
      <CancelRegistrationModal
        isOpen={Boolean(cancellingAttendee)}
        onClose={() => setCancellingAttendee(null)}
        attendee={cancellingAttendee}
        onConfirm={handleCancelRegistration}
      />

      {/* 19. WAITLIST MANAGER MODAL */}
      <WaitlistManagerModal
        isOpen={waitlistModalData.isOpen}
        onClose={() => setWaitlistModalData({ isOpen: false, attendee: null })}
        attendee={waitlistModalData.attendee}
        onConfirmPromote={handlePromoteWaitlist}
      />

      {/* 24. COMMUNICATION MODAL */}
      <CommunicationModal
        isOpen={commModalData.isOpen}
        onClose={() => setCommModalData({ isOpen: false, recipientsCount: 0, channel: 'email' })}
        recipientsCount={commModalData.recipientsCount}
        channel={commModalData.channel}
        onSend={handleSendCommunication}
      />

      {/* 25. IMPORT ATTENDEES MODAL */}
      <ImportAttendeesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportValid={handleImportValidRecords}
      />

      {/* TOAST FEEDBACK */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Attendees;
