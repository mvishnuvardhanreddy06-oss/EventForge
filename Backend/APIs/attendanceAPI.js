const express = require('express');
const router = express.Router();
const AttendanceModel = require('../models/AttendanceModel');
const RegistrationModel = require('../models/RegistrationModel');
const SessionModel = require('../models/SessionModel');
const EventModel = require('../models/EventModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const validateObjectId = require('../middlewares/validateObjectId');
const { emitCheckInUpdate, emitAttendanceUpdate } = require('../sockets/socket');
const { ROLES, ATTENDANCE_METHOD } = require('../utils/constants');

// Helper to check if staff/organizer is authorized for this event
const isAuthorizedForEvent = (event, user) => {
  if (!event || !user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.ORGANIZER) {
    if (user.organizationId && event.organizationId && user.organizationId.toString() === event.organizationId.toString()) return true;
    if (event.organizerId && user._id && event.organizerId.toString() === user._id.toString()) return true;
    return false;
  }
  if (user.role === ROLES.STAFF) {
    // Staff must be explicitly assigned to this event, not just same organization!
    const isAssigned = (event.assignedStaff && event.assignedStaff.some(id => id.toString() === user._id.toString())) ||
                       (user.assignedEvents && user.assignedEvents.some(id => id.toString() === event._id.toString()));
    return isAssigned;
  }
  return false;
};

// POST /api/attendance/scan (Staff scanning QR code for event check-in)
router.post('/scan', verifyToken, verifyRole(ROLES.STAFF, ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['qrToken', 'eventId']), async (req, res, next) => {
  try {
    const { qrToken, eventId } = req.body;

    if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid eventId format',
        error: { code: 'INVALID_OBJECT_ID' }
      });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: { code: 'EVENT_NOT_FOUND' }
      });
    }

    // Verify staff/organizer authorization for this event
    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized staff: You are not assigned to this event.',
        error: { code: 'FORBIDDEN_EVENT_CHECKIN' }
      });
    }

    // Find registration with this qrToken or registrationNumber
    const tokenQuery = (qrToken || '').trim();
    const registration = await RegistrationModel.findOne({
      $or: [
        { qrToken: tokenQuery },
        { registrationNumber: tokenQuery }
      ]
    })
      .populate('attendeeId', 'name email profileImage phone')
      .populate('ticketId', 'name price')
      .populate('eventId', 'title');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ticket: Registration record not found.',
        error: { code: 'INVALID_QR_TOKEN' }
      });
    }

    if (registration.eventId._id.toString() !== eventId) {
      return res.status(400).json({
        success: false,
        message: `Wrong event: This ticket is for "${registration.eventId.title}", not the selected event.`,
        error: { code: 'EVENT_MISMATCH' }
      });
    }

    if (registration.status !== 'confirmed' || registration.paymentStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: registration.paymentStatus === 'pending'
          ? 'Registration not confirmed: Payment is pending.'
          : `Registration not confirmed: Status is ${registration.status}.`,
        error: { code: 'TICKET_NOT_CONFIRMED' }
      });
    }

    // Duplicate check-in detection
    if (registration.checkedIn) {
      return res.status(409).json({
        success: false,
        message: `Already checked in at ${new Date(registration.checkedInAt).toLocaleTimeString()}`,
        error: {
          code: 'ALREADY_CHECKED_IN',
          checkedInAt: registration.checkedInAt,
          attendee: registration.attendeeId
        }
      });
    }

    // Mark checked in
    const checkedInTime = new Date();
    registration.checkedIn = true;
    registration.checkedInAt = checkedInTime;
    await registration.save();

    // Record in master event attendance
    await AttendanceModel.create({
      eventId,
      sessionId: null,
      attendeeId: registration.attendeeId._id,
      checkedInAt: checkedInTime,
      method: tokenQuery.startsWith('EFQR-') ? ATTENDANCE_METHOD.QR : ATTENDANCE_METHOD.MANUAL,
      checkedInBy: req.user._id
    });

    // Emit real-time check-in update to organizers & staff
    emitCheckInUpdate(eventId, {
      attendee: registration.attendeeId,
      ticket: registration.ticketId,
      checkedInAt: checkedInTime,
      registrationNumber: registration.registrationNumber
    });

    res.status(200).json({
      success: true,
      message: `Check-in Successful for ${registration.attendeeId.name}`,
      data: {
        registration,
        checkedIn: true,
        checkedInAt: checkedInTime,
        attendeeName: registration.attendeeId.name,
        eventTitle: registration.eventId.title,
        ticketTier: registration.ticketId?.name || 'General Admission',
        checkInTime: checkedInTime
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/attendance/session (Check-in to individual session)
router.post('/session', verifyToken, verifyRole(ROLES.STAFF, ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['sessionId', 'attendeeId']), async (req, res, next) => {
  try {
    const { sessionId, attendeeId, method = ATTENDANCE_METHOD.MANUAL } = req.body;

    if (!require('mongoose').Types.ObjectId.isValid(sessionId) || !require('mongoose').Types.ObjectId.isValid(attendeeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sessionId or attendeeId format',
        error: { code: 'INVALID_OBJECT_ID' }
      });
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to record session attendance for this event.',
        error: { code: 'FORBIDDEN_SESSION_ATTENDANCE' }
      });
    }

    // Check duplicate session attendance
    const existing = await AttendanceModel.findOne({
      sessionId,
      attendeeId
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Attendee is already checked into this session.',
        error: { code: 'DUPLICATE_SESSION_ATTENDANCE', checkedInAt: existing.checkedInAt }
      });
    }

    const attendance = await AttendanceModel.create({
      eventId: session.eventId,
      sessionId,
      attendeeId,
      method,
      checkedInBy: req.user._id
    });

    const populated = await AttendanceModel.findById(attendance._id)
      .populate('attendeeId', 'name email profileImage')
      .populate('sessionId', 'title category startTime');

    emitAttendanceUpdate(session.eventId, {
      sessionTitle: session.title,
      attendee: populated.attendeeId,
      time: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Session attendance recorded successfully',
      data: { attendance: populated }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/event/:eventId
router.get('/event/:eventId', verifyToken, validateObjectId('eventId'), async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const attendanceRecords = await AttendanceModel.find({ eventId, sessionId: null })
      .populate('attendeeId', 'name email phone profileImage')
      .populate('checkedInBy', 'name')
      .sort({ checkedInAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Event attendance retrieved',
      data: { attendanceRecords }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/session/:sessionId
router.get('/session/:sessionId', verifyToken, validateObjectId('sessionId'), async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await SessionModel.findById(sessionId)
      .populate('speakerId', 'name designation company profileImage')
      .populate('venueId', 'name rooms');

    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendance for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    // Existing check-in records for this session
    const sessionAttendance = await AttendanceModel.find({ sessionId })
      .populate('attendeeId', 'name email profileImage')
      .populate('checkedInBy', 'name')
      .sort({ checkedInAt: -1 });

    const checkedInMap = new Map();
    sessionAttendance.forEach(a => {
      if (a.attendeeId) {
        checkedInMap.set(a.attendeeId._id.toString(), {
          attendanceId: a._id,
          checkedInAt: a.checkedInAt,
          checkedInBy: a.checkedInBy?.name || 'Staff',
          method: a.method
        });
      }
    });

    // Registered attendees for the event
    const registrations = await RegistrationModel.find({
      eventId: session.eventId,
      status: 'confirmed'
    })
      .populate('attendeeId', 'name email phone profileImage')
      .populate('ticketId', 'name')
      .sort({ createdAt: 1 });

    const registeredAttendees = registrations
      .filter(r => r.attendeeId)
      .map(r => {
        const attInfo = checkedInMap.get(r.attendeeId._id.toString());
        return {
          attendeeId: r.attendeeId._id,
          name: r.attendeeId.name,
          email: r.attendeeId.email,
          phone: r.attendeeId.phone || '',
          ticketName: r.ticketId?.name || 'General Admission',
          registrationNumber: r.registrationNumber,
          isCheckedIn: Boolean(attInfo),
          checkedInAt: attInfo ? attInfo.checkedInAt : null,
          checkedInBy: attInfo ? attInfo.checkedInBy : null,
          method: attInfo ? attInfo.method : null,
          attendanceId: attInfo ? attInfo.attendanceId : null
        };
      });

    res.status(200).json({
      success: true,
      message: 'Session attendance retrieved',
      data: {
        session,
        sessionAttendance,
        registeredAttendees,
        totalRegistered: registeredAttendees.length,
        totalCheckedIn: sessionAttendance.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/attendance/session/:sessionId/:attendeeId (Unmark session attendance)
router.delete('/session/:sessionId/:attendeeId', verifyToken, verifyRole(ROLES.STAFF, ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { sessionId, attendeeId } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(sessionId) || !require('mongoose').Types.ObjectId.isValid(attendeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format', error: { code: 'INVALID_OBJECT_ID' } });
    }

    const session = await SessionModel.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized staff: You are not assigned to this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    const deleted = await AttendanceModel.findOneAndDelete({ sessionId, attendeeId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Session attendance unmarked successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/history (Attendee viewing own attendance history)
router.get('/history', verifyToken, async (req, res, next) => {
  try {
    const history = await AttendanceModel.find({ attendeeId: req.user._id })
      .populate('eventId', 'title startDate endDate bannerImage')
      .populate('sessionId', 'title category startTime endTime')
      .sort({ checkedInAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Attendance history retrieved',
      data: { history }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
