const express = require('express');
const router = express.Router();
const AttendanceModel = require('../models/AttendanceModel');
const RegistrationModel = require('../models/RegistrationModel');
const SessionModel = require('../models/SessionModel');
const EventModel = require('../models/EventModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { emitCheckInUpdate, emitAttendanceUpdate } = require('../sockets/socket');
const { ROLES, ATTENDANCE_METHOD } = require('../utils/constants');

// POST /api/attendance/scan (Staff scanning QR code for event check-in)
router.post('/scan', verifyToken, verifyRole(ROLES.STAFF, ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['qrToken', 'eventId']), async (req, res, next) => {
  try {
    const { qrToken, eventId } = req.body;

    // Find registration with this qrToken
    const registration = await RegistrationModel.findOne({ qrToken })
      .populate('attendeeId', 'name email profileImage phone')
      .populate('ticketId', 'name price')
      .populate('eventId', 'title');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR Token. Registration record not found.',
        error: { code: 'INVALID_QR_TOKEN' }
      });
    }

    if (registration.eventId._id.toString() !== eventId) {
      return res.status(400).json({
        success: false,
        message: `This ticket is for "${registration.eventId.title}", not the selected event.`,
        error: { code: 'EVENT_MISMATCH' }
      });
    }

    if (registration.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Ticket status is ${registration.status}. Only confirmed tickets can be checked in.`,
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
      method: ATTENDANCE_METHOD.QR,
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
      message: `Check-in successful for ${registration.attendeeId.name}`,
      data: {
        registration,
        checkedInAt: checkedInTime
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

    const session = await SessionModel.findById(sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

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
router.get('/event/:eventId', verifyToken, async (req, res, next) => {
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
router.get('/session/:sessionId', verifyToken, async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const sessionAttendance = await AttendanceModel.find({ sessionId })
      .populate('attendeeId', 'name email profileImage')
      .sort({ checkedInAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Session attendance retrieved',
      data: { sessionAttendance }
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
