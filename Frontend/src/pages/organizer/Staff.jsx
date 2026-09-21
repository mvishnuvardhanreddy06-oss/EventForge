import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Plus
} from 'lucide-react';
import {
  staffService,
  MOCK_EVENTS,
  MOCK_VENUES,
  MOCK_SESSIONS,
  STAFF_ROLES
} from '../../services/staffService';
import { formatIndianPhone } from '../../utils/phoneUtils';

// Reusable Components
import StaffSummaryCards from '../../components/organizer/staff/StaffSummaryCards';
import StaffToolbar from '../../components/organizer/staff/StaffToolbar';
import StaffSearch from '../../components/organizer/staff/StaffSearch';
import StaffFilters from '../../components/organizer/staff/StaffFilters';
import StaffGrid from '../../components/organizer/staff/StaffGrid';
import StaffList from '../../components/organizer/staff/StaffList';
import StaffDetailsDrawer from '../../components/organizer/staff/StaffDetailsDrawer';
import StaffForm from '../../components/organizer/staff/StaffForm';
import InviteStaffModal from '../../components/organizer/staff/InviteStaffModal';
import AssignStaffModal from '../../components/organizer/staff/AssignStaffModal';
import ShiftManager from '../../components/organizer/staff/ShiftManager';
import ShiftForm from '../../components/organizer/staff/ShiftForm';
import StaffAvailability from '../../components/organizer/staff/StaffAvailability';
import StaffAttendance from '../../components/organizer/staff/StaffAttendance';
import StaffCommunicationModal from '../../components/organizer/staff/StaffCommunicationModal';
import ImportStaffModal from '../../components/organizer/staff/ImportStaffModal';
import DeactivateStaffModal from '../../components/organizer/staff/DeactivateStaffModal';
import EmptyState from '../../components/organizer/staff/EmptyState';
import SearchEmptyState from '../../components/organizer/staff/SearchEmptyState';
import Pagination from '../../components/organizer/staff/Pagination';

const Staff = () => {
  // Master Datasets
  const [staffList, setStaffList] = useState([]);
  const [shiftsList, setShiftsList] = useState([]);
  const [events] = useState(MOCK_EVENTS);
  const [venues] = useState(MOCK_VENUES);
  const [sessions] = useState(MOCK_SESSIONS);

  // Top Selector & View Controls
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (default per #6), 'list', 'shifts'

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    assignment: 'all',
    shift: 'all',
    eventId: 'all'
  });

  // Table/Grid Selection & Pagination
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === 'grid' ? 12 : 10;

  // Active Modals & Drawer State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [inspectingStaff, setInspectingStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [assigningStaff, setAssigningStaff] = useState(null);
  const [deactivatingStaff, setDeactivatingStaff] = useState(null);
  const [shiftModalData, setShiftModalData] = useState({ isOpen: false, shift: null });
  const [availabilityStaff, setAvailabilityStaff] = useState(null);
  const [attendanceStaff, setAttendanceStaff] = useState(null);
  const [communicationModalData, setCommunicationModalData] = useState({ isOpen: false, recipients: [] });

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Initial Data from localStorage or Service
  useEffect(() => {
    const loadedStaff = staffService.getStaffList();
    const loadedShifts = staffService.getShiftsList();
    setStaffList(loadedStaff);
    setShiftsList(loadedShifts);
  }, []);

  // Sync state to localStorage whenever modified
  const updateStaffList = (newList) => {
    setStaffList(newList);
    staffService.saveStaffList(newList);
  };

  const updateShiftsList = (newList) => {
    setShiftsList(newList);
    staffService.saveShiftsList(newList);
  };

  // Compute 5 Summary Metrics
  const metrics = useMemo(() => {
    return staffService.computeSummaryMetrics(staffList, shiftsList);
  }, [staffList, shiftsList]);

  // Handle Event Selector Changes
  const handleEventChange = (evtId) => {
    setSelectedEventId(evtId);
    setFilters((prev) => ({ ...prev, eventId: evtId }));
    setCurrentPage(1);
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'eventId') setSelectedEventId(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      role: 'all',
      status: 'all',
      assignment: 'all',
      shift: 'all',
      eventId: 'all'
    });
    setSelectedEventId('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    filters.role !== 'all' ||
    filters.status !== 'all' ||
    filters.assignment !== 'all' ||
    filters.shift !== 'all' ||
    filters.eventId !== 'all'
  );

  // Filtered dataset
  const filteredStaff = useMemo(() => {
    return staffList.filter((st) => {
      // Organization Scope Check (Section 3 & 34)
      if (st.organizationId && st.organizationId !== 'org-apex') {
        return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${st.firstName} ${st.lastName}`.toLowerCase();
        const email = (st.email || '').toLowerCase();
        const phone = (st.phone || '').toLowerCase();
        const role = (st.role || '').toLowerCase();
        const company = (st.company || '').toLowerCase();
        const assignment = (st.currentAssignment || '').toLowerCase();

        const matches =
          fullName.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          role.includes(q) ||
          company.includes(q) ||
          assignment.includes(q);

        if (!matches) return false;
      }

      // Event Filter
      if (filters.eventId !== 'all') {
        const matchesEvent = st.eventIds && st.eventIds.includes(filters.eventId);
        if (!matchesEvent) return false;
      }

      // Role Filter
      if (filters.role !== 'all' && st.role !== filters.role) {
        return false;
      }

      // Status Filter (Active, Inactive, Invited)
      if (filters.status !== 'all' && st.status !== filters.status) {
        return false;
      }

      // Assignment Filter (Assigned vs Unassigned)
      if (filters.assignment === 'Assigned') {
        const isAssigned = Boolean(st.currentAssignment && st.currentAssignment !== 'Unassigned') || (st.assignments?.length > 0);
        if (!isAssigned) return false;
      } else if (filters.assignment === 'Unassigned') {
        const isAssigned = Boolean(st.currentAssignment && st.currentAssignment !== 'Unassigned') || (st.assignments?.length > 0);
        if (isAssigned) return false;
      }

      // Shift Filter (Today, Upcoming, Completed)
      if (filters.shift === 'Today') {
        if (st.attendanceStatus !== 'On Duty' && st.attendanceStatus !== 'Checked In') {
          return false;
        }
      } else if (filters.shift === 'Upcoming') {
        if (st.attendanceStatus !== 'Scheduled') return false;
      } else if (filters.shift === 'Completed') {
        if (st.attendanceStatus !== 'Checked Out') return false;
      }

      return true;
    });
  }, [staffList, searchQuery, filters]);

  // Paginated View Slice
  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStaff.slice(startIndex, startIndex + pageSize);
  }, [filteredStaff, currentPage, pageSize]);

  // Multi-select actions
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStaff.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStaff.map((s) => s._id));
    }
  };

  // 1. ADD STAFF SUBMIT
  const handleAddStaffSubmit = (newStaffData) => {
    const newStaff = {
      ...newStaffData,
      _id: `stf-${Date.now()}`,
      organizationId: 'org-apex',
      status: 'Active',
      attendanceStatus: 'Scheduled',
      currentAssignment: null,
      shift: 'Unassigned',
      shiftTime: 'Not Scheduled',
      availability: 'Available',
      assignments: [],
      sessionsManaged: 0,
      checkInsAssisted: 0,
      tasksCompleted: 0,
      checkInTime: null,
      checkInDate: null,
      checkedInBy: null,
      checkOutTime: null,
      totalShiftDuration: null,
      workload: 0,
      activeResponsibilities: 0
    };

    const updated = [newStaff, ...staffList];
    updateStaffList(updated);
    setShowAddModal(false);
    showToast('✓ Staff member added successfully.');
  };

  // 2. EDIT STAFF SUBMIT
  const handleEditStaffSubmit = (updatedData) => {
    const updated = staffList.map((s) => (s._id === updatedData._id ? { ...s, ...updatedData } : s));
    updateStaffList(updated);
    if (inspectingStaff?._id === updatedData._id) {
      setInspectingStaff({ ...inspectingStaff, ...updatedData });
    }
    setEditingStaff(null);
    showToast('✓ Staff profile updated successfully.');
  };

  // 3. INVITE STAFF SUBMIT (Section 11)
  const handleInviteStaffSubmit = (inviteData) => {
    const newInvited = {
      _id: `stf-inv-${Date.now()}`,
      organizationId: 'org-apex',
      firstName: inviteData.firstName,
      lastName: inviteData.lastName,
      email: inviteData.email,
      phone: inviteData.phone,
      role: inviteData.role,
      company: 'Apex Global Events',
      designation: inviteData.role,
      department: 'Operations',
      eventIds: [inviteData.eventId],
      eventTitle: inviteData.eventTitle,
      status: 'Invited', // Status: Invited
      attendanceStatus: 'Scheduled',
      currentAssignment: null,
      shift: 'Pending Invitation Acceptance',
      shiftTime: 'Pending Confirmation',
      availability: 'Available',
      emergencyContact: '',
      notes: inviteData.message,
      assignments: [],
      sessionsManaged: 0,
      checkInsAssisted: 0,
      tasksCompleted: 0,
      checkInTime: null,
      checkInDate: null,
      checkedInBy: null,
      checkOutTime: null,
      totalShiftDuration: null,
      workload: 0,
      activeResponsibilities: 0
    };

    const updated = [newInvited, ...staffList];
    updateStaffList(updated);
    setShowInviteModal(false);
    // After sending: ✓ Staff invitation sent successfully.
    showToast('✓ Staff invitation sent successfully.');
  };

  // 4. ASSIGN STAFF SUBMIT (Section 13 & 14)
  const handleAssignStaffSuccess = (assignment) => {
    const updated = staffList.map((st) => {
      if (st._id === assignment.staffId) {
        const newAssignmentObj = {
          id: `asg-${Date.now()}`,
          name: assignment.room || assignment.venue,
          type: assignment.role,
          sessionTitle: assignment.sessionTitle
        };
        const curAssignments = st.assignments || [];
        return {
          ...st,
          currentAssignment: assignment.room || assignment.venue,
          shift: assignment.shift,
          shiftTime: assignment.shift,
          assignments: [newAssignmentObj, ...curAssignments],
          activeResponsibilities: (st.activeResponsibilities || 0) + 1,
          workload: Math.min(95, (st.workload || 40) + 25)
        };
      }
      return st;
    });

    // Also register a shift record
    const newShiftRecord = {
      _id: `shf-${Date.now()}`,
      staffId: assignment.staffId,
      staffName: assignment.staffName,
      role: assignment.role,
      eventId: assignment.eventId,
      eventTitle: assignment.eventTitle,
      venue: assignment.venue,
      room: assignment.room,
      date: assignment.date,
      startTime: assignment.startTime,
      endTime: assignment.endTime,
      status: 'Scheduled',
      notes: `Assigned for ${assignment.sessionTitle || assignment.room}`
    };

    updateStaffList(updated);
    updateShiftsList([newShiftRecord, ...shiftsList]);

    if (inspectingStaff?._id === assignment.staffId) {
      const refreshed = updated.find((s) => s._id === assignment.staffId);
      if (refreshed) setInspectingStaff(refreshed);
    }

    setAssigningStaff(null);
    showToast('✓ Staff member assigned successfully.');
  };

  // 5. STAFF CHECK-IN (Section 18)
  const handleRecordAttendance = (data) => {
    if (data.action === 'check_in') {
      const updated = staffList.map((st) => {
        if (st._id === data.staffId) {
          return {
            ...st,
            attendanceStatus: 'On Duty',
            checkInTime: data.checkInTime,
            checkInDate: data.checkInDate,
            checkedInBy: data.checkedInBy
          };
        }
        return st;
      });
      updateStaffList(updated);
      if (inspectingStaff?._id === data.staffId) {
        setInspectingStaff((prev) => ({
          ...prev,
          attendanceStatus: 'On Duty',
          checkInTime: data.checkInTime,
          checkInDate: data.checkInDate,
          checkedInBy: data.checkedInBy
        }));
      }
      setAttendanceStaff(null);
      // Show: ✓ Staff checked in successfully.
      showToast('✓ Staff checked in successfully.');
    } else if (data.action === 'check_out') {
      const updated = staffList.map((st) => {
        if (st._id === data.staffId) {
          return {
            ...st,
            attendanceStatus: 'Checked Out',
            checkOutTime: data.checkOutTime,
            totalShiftDuration: data.totalShiftDuration
          };
        }
        return st;
      });
      updateStaffList(updated);
      if (inspectingStaff?._id === data.staffId) {
        setInspectingStaff((prev) => ({
          ...prev,
          attendanceStatus: 'Checked Out',
          checkOutTime: data.checkOutTime,
          totalShiftDuration: data.totalShiftDuration
        }));
      }
      setAttendanceStaff(null);
      // Show: ✓ Staff checked out successfully.
      showToast(`✓ Staff checked out successfully. Duration: ${data.totalShiftDuration}`);
    }
  };

  // Quick Check-in / Check-out directly from card or list
  const handleQuickCheckIn = (staff) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    handleRecordAttendance({
      staffId: staff._id,
      action: 'check_in',
      checkInTime: timeNow,
      checkInDate: 'Sep 24, 2026',
      checkedInBy: 'Vishnureddy (Organizer)'
    });
  };

  const handleQuickCheckOut = (staff) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    handleRecordAttendance({
      staffId: staff._id,
      action: 'check_out',
      checkOutTime: timeNow,
      totalShiftDuration: '09h 12m'
    });
  };

  // 6. AVAILABILITY SAVE (Section 20)
  const handleSaveAvailability = (availData) => {
    const updated = staffList.map((st) => {
      if (st._id === availData.staffId) {
        return {
          ...st,
          availability: availData.availability,
          notes: availData.notes ? `${st.notes ? st.notes + ' | ' : ''}Availability: ${availData.notes}` : st.notes
        };
      }
      return st;
    });
    updateStaffList(updated);
    if (inspectingStaff?._id === availData.staffId) {
      setInspectingStaff((prev) => ({ ...prev, availability: availData.availability }));
    }
    setAvailabilityStaff(null);
    showToast(`✓ Availability updated to: ${availData.availability}`);
  };

  // 7. DEACTIVATE STAFF (Section 26)
  const handleConfirmDeactivate = (staff) => {
    const updated = staffList.map((st) => {
      if (st._id === staff._id) {
        return {
          ...st,
          status: 'Inactive',
          attendanceStatus: 'Absent',
          currentAssignment: null,
          shift: 'Deactivated',
          availability: 'Unavailable',
          assignments: []
        };
      }
      return st;
    });
    updateStaffList(updated);
    if (inspectingStaff?._id === staff._id) {
      setInspectingStaff(null);
    }
    setDeactivatingStaff(null);
    showToast('✓ Staff member deactivated successfully.');
  };

  // 8. SEND MESSAGE (Section 25)
  const handleSendMessageSubmit = (msgData) => {
    setCommunicationModalData({ isOpen: false, recipients: [] });
    // Success: ✓ Message queued successfully.
    showToast(`✓ Message queued successfully for ${msgData.recipientsCount} recipient(s).`);
  };

  // 9. IMPORT STAFF (Section 27)
  const handleImportSuccess = (importedRecords) => {
    const withIds = importedRecords.map((r, i) => ({
      ...r,
      _id: `stf-imp-${Date.now()}-${i}`,
      organizationId: 'org-apex',
      shift: '08:00 AM – 06:00 PM',
      shiftTime: '08:00 AM – 06:00 PM',
      currentAssignment: 'Unassigned',
      assignments: [],
      sessionsManaged: 0,
      checkInsAssisted: 0,
      tasksCompleted: 0,
      workload: 0,
      activeResponsibilities: 0
    }));

    const updated = [...withIds, ...staffList];
    updateStaffList(updated);
    setShowImportModal(false);
    showToast(`✓ Successfully imported ${importedRecords.length} staff members.`);
  };

  // 10. EXPORT STAFF (Section 28)
  const handleExport = (format) => {
    // Only export staff belonging to organizer's organization
    const orgStaff = staffList.filter((s) => !s.organizationId || s.organizationId === 'org-apex');

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Attendance', 'Assignment', 'Shift'];
    const rows = orgStaff.map((s) => [
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      `"${s.email}"`,
      `"${formatIndianPhone(s.phone)}"`,
      `"${s.role}"`,
      `"${s.status}"`,
      `"${s.attendanceStatus}"`,
      `"${s.currentAssignment || 'Unassigned'}"`,
      `"${s.shift || '08:00–06:00'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eventforge-staff-roster-${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xls' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Staff roster exported successfully (${format.toUpperCase()}).`);
  };

  // 11. BULK ACTIONS (Section 24)
  const handleBulkAssign = () => {
    if (selectedIds.length === 0) return;
    const firstSelected = staffList.find((s) => s._id === selectedIds[0]);
    setAssigningStaff(firstSelected);
  };

  const handleBulkCreateShift = () => {
    if (selectedIds.length === 0) return;
    const firstSelected = staffList.find((s) => s._id === selectedIds[0]);
    setShiftModalData({
      isOpen: true,
      shift: {
        staffId: firstSelected._id,
        role: firstSelected.role,
        date: 'Sep 24, 2026',
        startTime: '08:00 AM',
        endTime: '06:00 PM',
        venue: 'Hyderabad International Convention Centre',
        room: 'Hall A'
      }
    });
  };

  const handleBulkSendMessage = () => {
    const selectedStaffList = staffList.filter((s) => selectedIds.includes(s._id));
    setCommunicationModalData({
      isOpen: true,
      recipients: selectedStaffList
    });
  };

  const handleBulkExport = () => {
    handleExport('csv');
  };

  const handleBulkDeactivate = () => {
    const firstSelected = staffList.find((s) => s._id === selectedIds[0]);
    if (firstSelected) {
      setDeactivatingStaff(firstSelected);
    }
  };

  // 12. SHIFT MANAGER ACTIONS (Section 15 & 16)
  const handleAddShiftSubmit = (shiftPayload) => {
    if (shiftPayload._id) {
      // Edit
      const updated = shiftsList.map((sh) => (sh._id === shiftPayload._id ? shiftPayload : sh));
      updateShiftsList(updated);
      showToast('✓ Shift updated successfully.');
    } else {
      // New
      const newSh = {
        ...shiftPayload,
        _id: `shf-${Date.now()}`
      };
      updateShiftsList([newSh, ...shiftsList]);
      showToast('✓ Shift scheduled successfully.');
    }
    setShiftModalData({ isOpen: false, shift: null });
  };

  const handleDuplicateShift = (shift) => {
    const dup = {
      ...shift,
      _id: `shf-${Date.now()}`,
      notes: `${shift.notes || ''} (Duplicated)`
    };
    updateShiftsList([dup, ...shiftsList]);
    showToast('✓ Shift duplicated successfully.');
  };

  const handleCancelShift = (shift) => {
    const updated = shiftsList.map((sh) =>
      sh._id === shift._id ? { ...sh, status: 'Cancelled' } : sh
    );
    updateShiftsList(updated);
    showToast('✓ Shift cancelled.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-70 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-semibold animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Master Toolbar with Header, Event Selector, View Toggle, Actions */}
      <StaffToolbar
        events={events}
        selectedEventId={selectedEventId}
        onEventChange={handleEventChange}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          setCurrentPage(1);
        }}
        onOpenAddModal={() => setShowAddModal(true)}
        onOpenInviteModal={() => setShowInviteModal(true)}
        onOpenImportModal={() => setShowImportModal(true)}
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkAssign={handleBulkAssign}
        onBulkCreateShift={handleBulkCreateShift}
        onBulkSendMessage={handleBulkSendMessage}
        onBulkExport={handleBulkExport}
        onBulkDeactivate={handleBulkDeactivate}
        onExportFiltered={handleExport}
      />

      {/* 2. Summary Metric Cards (Section 4) */}
      <StaffSummaryCards
        metrics={metrics}
        activeFilter={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Main Staff View Switcher: Shifts vs Grid/List */}
      {viewMode === 'shifts' ? (
        /* Section 15: Staff Shifts View */
        <ShiftManager
          shifts={shiftsList}
          onOpenAddShift={() => setShiftModalData({ isOpen: true, shift: null })}
          onEditShift={(sh) => setShiftModalData({ isOpen: true, shift: sh })}
          onDuplicateShift={handleDuplicateShift}
          onCancelShift={handleCancelShift}
        />
      ) : (
        /* Standard Staff Roster: Search, Filters, Grid/List */
        <div className="space-y-4">
          {/* Search & Filters Row (Section 5) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <StaffSearch
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              onClear={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
            />

            <StaffFilters
              filters={filters}
              events={events}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Content Body: Empty State / Search Empty State / Grid / List */}
          {staffList.length === 0 ? (
            <EmptyState onAddStaff={() => setShowAddModal(true)} />
          ) : filteredStaff.length === 0 ? (
            <SearchEmptyState onClearFilters={handleResetFilters} />
          ) : viewMode === 'grid' ? (
            /* Grid View (Section 6 & 7) */
            <StaffGrid
              staffList={paginatedStaff}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onViewProfile={(st) => setInspectingStaff(st)}
              onEditStaff={(st) => setEditingStaff(st)}
              onAssignStaff={(st) => setAssigningStaff(st)}
              onAddShift={(st) =>
                setShiftModalData({
                  isOpen: true,
                  shift: { staffId: st._id, role: st.role, date: 'Sep 24, 2026' }
                })
              }
              onCheckIn={handleQuickCheckIn}
              onCheckOut={handleQuickCheckOut}
              onDeactivate={(st) => setDeactivatingStaff(st)}
              onSendMessage={(st) =>
                setCommunicationModalData({ isOpen: true, recipients: [st] })
              }
            />
          ) : (
            /* List View (Section 23) */
            <StaffList
              staffList={paginatedStaff}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onViewProfile={(st) => setInspectingStaff(st)}
              onEditStaff={(st) => setEditingStaff(st)}
              onAssignStaff={(st) => setAssigningStaff(st)}
              onAddShift={(st) =>
                setShiftModalData({
                  isOpen: true,
                  shift: { staffId: st._id, role: st.role, date: 'Sep 24, 2026' }
                })
              }
              onCheckIn={handleQuickCheckIn}
              onCheckOut={handleQuickCheckOut}
              onDeactivate={(st) => setDeactivatingStaff(st)}
              onSendMessage={(st) =>
                setCommunicationModalData({ isOpen: true, recipients: [st] })
              }
            />
          )}

          {/* Pagination Controls */}
          {filteredStaff.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredStaff.length}
              pageSize={pageSize}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </div>
      )}

      {/* 3. MODALS & SLIDE-OVER DRAWERS */}

      {/* Staff Details Drawer (Section 12) */}
      <StaffDetailsDrawer
        isOpen={Boolean(inspectingStaff)}
        staff={inspectingStaff}
        onClose={() => setInspectingStaff(null)}
        onEditStaff={(st) => setEditingStaff(st)}
        onAssignStaff={(st) => setAssigningStaff(st)}
        onAddShift={(st) =>
          setShiftModalData({
            isOpen: true,
            shift: { staffId: st._id, role: st.role, date: 'Sep 24, 2026' }
          })
        }
        onCheckIn={handleQuickCheckIn}
        onCheckOut={handleQuickCheckOut}
        onSendMessage={(st) =>
          setCommunicationModalData({ isOpen: true, recipients: [st] })
        }
        onDeactivate={(st) => setDeactivatingStaff(st)}
      />

      {/* Add Staff Modal (Section 9 & 10) */}
      <StaffForm
        isOpen={showAddModal}
        events={events}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStaffSubmit}
      />

      {/* Edit Staff Modal */}
      <StaffForm
        isOpen={Boolean(editingStaff)}
        initialData={editingStaff}
        events={events}
        onClose={() => setEditingStaff(null)}
        onSubmit={handleEditStaffSubmit}
      />

      {/* Invite Staff Modal (Section 11) */}
      <InviteStaffModal
        isOpen={showInviteModal}
        events={events}
        selectedEventId={selectedEventId}
        onClose={() => setShowInviteModal(false)}
        onSendInvitation={handleInviteStaffSubmit}
      />

      {/* Assign Staff Modal (Section 13 & 14) */}
      <AssignStaffModal
        isOpen={Boolean(assigningStaff)}
        preselectedStaff={assigningStaff}
        staffList={staffList}
        shiftsList={shiftsList}
        events={events}
        venues={venues}
        sessions={sessions}
        onClose={() => setAssigningStaff(null)}
        onAssignSuccess={handleAssignStaffSuccess}
      />

      {/* Create / Edit Shift Modal (Section 16) */}
      <ShiftForm
        isOpen={shiftModalData.isOpen}
        initialShift={shiftModalData.shift}
        staffList={staffList}
        venues={venues}
        onClose={() => setShiftModalData({ isOpen: false, shift: null })}
        onSubmit={handleAddShiftSubmit}
      />

      {/* Staff Availability Modal (Section 20) */}
      <StaffAvailability
        isOpen={Boolean(availabilityStaff)}
        staff={availabilityStaff}
        onClose={() => setAvailabilityStaff(null)}
        onSave={handleSaveAvailability}
      />

      {/* Staff Attendance Verification Modal (Section 17, 18, 19) */}
      <StaffAttendance
        isOpen={Boolean(attendanceStaff)}
        staff={attendanceStaff}
        onClose={() => setAttendanceStaff(null)}
        onRecordAttendance={handleRecordAttendance}
      />

      {/* Staff Communication Modal (Section 25) */}
      <StaffCommunicationModal
        isOpen={communicationModalData.isOpen}
        recipients={communicationModalData.recipients}
        onClose={() => setCommunicationModalData({ isOpen: false, recipients: [] })}
        onSendMessage={handleSendMessageSubmit}
      />

      {/* Import Staff Modal (Section 27) */}
      <ImportStaffModal
        isOpen={showImportModal}
        existingStaff={staffList}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Safe Deactivate Staff Modal (Section 26) */}
      <DeactivateStaffModal
        isOpen={Boolean(deactivatingStaff)}
        staff={deactivatingStaff}
        onClose={() => setDeactivatingStaff(null)}
        onConfirmDeactivate={handleConfirmDeactivate}
        onReviewAssignments={(st) => setInspectingStaff(st)}
      />
    </div>
  );
};

export default Staff;
