import React, { useState, useEffect } from 'react';
import { X, UserCheck, Calendar, MapPin, Clock, Layers, AlertTriangle } from 'lucide-react';
import {
  MOCK_EVENTS,
  MOCK_VENUES,
  MOCK_SESSIONS,
  STAFF_ROLES,
  staffService
} from '../../../services/staffService';
import AssignmentConflictAlert from './AssignmentConflictAlert';

const AssignStaffModal = ({
  isOpen,
  preselectedStaff = null,
  staffList = [],
  shiftsList = [],
  events = MOCK_EVENTS,
  venues = MOCK_VENUES,
  sessions = MOCK_SESSIONS,
  onClose,
  onAssignSuccess
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [eventId, setEventId] = useState('evt-1');
  const [role, setRole] = useState('Session Coordinator');
  const [venueId, setVenueId] = useState('ven-1');
  const [room, setRoom] = useState('Hall A');
  const [sessionId, setSessionId] = useState('ses-1');
  const [date, setDate] = useState('Sep 24, 2026');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');

  const [conflict, setConflict] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (preselectedStaff) {
        setSelectedStaffId(preselectedStaff._id);
        setRole(preselectedStaff.role || 'Session Coordinator');
        setEventId(preselectedStaff.eventIds?.[0] || 'evt-1');
      } else if (staffList.length > 0) {
        setSelectedStaffId(staffList[0]._id);
        setRole(staffList[0].role || 'Session Coordinator');
      }
      setVenueId('ven-1');
      setRoom('Hall A');
      setSessionId('ses-1');
      setDate('Sep 24, 2026');
      setStartTime('09:00 AM');
      setEndTime('05:00 PM');
      setConflict(null);
    }
  }, [isOpen, preselectedStaff, staffList]);

  if (!isOpen) return null;

  const currentVenue = venues.find((v) => v._id === venueId) || venues[0];
  const availableRooms = currentVenue?.rooms || ['Hall A', 'Hall B', 'Main Auditorium'];
  const activeStaffMember = staffList.find((s) => s._id === selectedStaffId) || preselectedStaff;

  const handleVenueChange = (newVenId) => {
    setVenueId(newVenId);
    const ven = venues.find((v) => v._id === newVenId);
    if (ven && ven.rooms && ven.rooms.length > 0) {
      setRoom(ven.rooms[0]);
    }
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!activeStaffMember) return;

    const selectedEvt = events.find((ev) => ev._id === eventId);
    const selectedSes = sessions.find((s) => s._id === sessionId);

    const newAssignment = {
      staffId: activeStaffMember._id,
      staffName: `${activeStaffMember.firstName} ${activeStaffMember.lastName}`,
      eventId,
      eventTitle: selectedEvt ? selectedEvt.title : 'Global Tech Leadership Summit 2026',
      role,
      venue: currentVenue?.name || 'Hyderabad International Convention Centre',
      venueId,
      room,
      sessionId,
      sessionTitle: selectedSes ? selectedSes.title : 'AI Infrastructure at Scale',
      date,
      startTime,
      endTime,
      shift: `${startTime} – ${endTime}`
    };

    // Conflict Check
    const detectedConflict = staffService.detectAssignmentConflict(
      activeStaffMember,
      newAssignment,
      shiftsList
    );

    if (detectedConflict) {
      setConflict(detectedConflict);
      return;
    }

    onAssignSuccess(newAssignment);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Assign Staff</h2>
                <p className="text-xs text-slate-500">Deploy staff to an event venue, room, and session schedule.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAssign} className="p-6 space-y-4 text-xs">
            {/* Staff Member Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staff Member <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => {
                  const sId = e.target.value;
                  setSelectedStaffId(sId);
                  const st = staffList.find((s) => s._id === sId);
                  if (st) setRole(st.role || 'Session Coordinator');
                }}
                disabled={Boolean(preselectedStaff)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                {staffList.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.firstName} {st.lastName} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Event & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Event <span className="text-rose-500">*</span>
                </label>
                <select
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  {STAFF_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Venue & Room */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue</label>
                <select
                  value={venueId}
                  onChange={(e) => handleVenueChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  {venues.map((ven) => (
                    <option key={ven._id} value={ven._id}>
                      {ven.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room / Hall</label>
                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  {availableRooms.map((rm) => (
                    <option key={rm} value={rm}>
                      {rm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session Track (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session</label>
              <select
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                <option value="">General Hall Coverage (No specific session)</option>
                {sessions.map((ses) => (
                  <option key={ses._id} value={ses._id}>
                    {ses.title} ({ses.time})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Shift Times */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Sep 24, 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="05:00 PM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Overlap Conflict Modal */}
      {conflict && (
        <AssignmentConflictAlert
          conflict={conflict}
          onChooseDifferentStaff={() => setConflict(null)}
          onAdjustShift={() => {
            setStartTime('02:30 PM');
            setEndTime('06:30 PM');
            setConflict(null);
          }}
          onClose={() => setConflict(null)}
        />
      )}
    </>
  );
};

export default AssignStaffModal;
