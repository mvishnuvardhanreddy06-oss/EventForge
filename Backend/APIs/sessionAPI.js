const express = require('express');
const router = express.Router();
const SessionModel = require('../models/SessionModel');
const EventModel = require('../models/EventModel');
const { checkRoomConflict, checkSpeakerConflict } = require('../utils/validateSchedule');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const validateObjectId = require('../middlewares/validateObjectId');
const { ROLES } = require('../utils/constants');

const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

// Helper to check event ownership / authorization
const isAuthorizedForEvent = (event, user) => {
  if (!event || !user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.organizationId && event.organizationId && user.organizationId.toString() === event.organizationId.toString()) return true;
  if (event.organizerId && user._id && event.organizerId.toString() === user._id.toString()) return true;
  return false;
};

// Helper to decode bearer token if present
const decodeRequester = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// GET /api/sessions
router.get('/', async (req, res, next) => {
  try {
    const { eventId, speakerId, category, roomId } = req.query;
    const query = {};

    const requester = decodeRequester(req);

    // If requester is Staff, enforce explicit event assignment
    if (requester && requester.role === ROLES.STAFF) {
      const staffUser = await UserModel.findById(requester.id);
      const assignedEvents = staffUser?.assignedEvents || [];

      if (eventId) {
        if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
          return res.status(400).json({ success: false, message: 'Invalid eventId format' });
        }
        const event = await EventModel.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const isAssigned = (event.assignedStaff && event.assignedStaff.some(id => id.toString() === requester.id.toString())) ||
                           assignedEvents.some(id => id.toString() === eventId.toString());
        if (!isAssigned) {
          return res.status(403).json({
            success: false,
            message: 'You are not authorized to view sessions for this event.',
            error: { code: 'FORBIDDEN_EVENT_ACCESS' }
          });
        }
        query.eventId = eventId;
      } else {
        // Staff did not specify eventId: restrict strictly to staff's assigned events
        const staffEvents = await EventModel.find({
          $or: [
            { assignedStaff: requester.id },
            { _id: { $in: assignedEvents } }
          ]
        }).select('_id');
        const staffEventIds = staffEvents.map(e => e._id);
        query.eventId = { $in: staffEventIds };
      }
    } else {
      if (eventId) {
        if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
          return res.status(400).json({ success: false, message: 'Invalid eventId format' });
        }
        query.eventId = eventId;
      }
    }

    if (speakerId) {
      if (!require('mongoose').Types.ObjectId.isValid(speakerId)) {
        return res.status(400).json({ success: false, message: 'Invalid speakerId format' });
      }
      query.speakerId = speakerId;
    }
    if (category) query.category = category;
    if (roomId) query.roomId = roomId;

    const sessions = await SessionModel.find(query)
      .populate('speakerId', 'name designation company profileImage')
      .populate('venueId', 'name rooms')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      message: 'Sessions retrieved successfully',
      data: { sessions }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/:id
router.get('/:id', validateObjectId('id'), async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id)
      .populate('speakerId', 'name designation company profileImage')
      .populate('venueId', 'name rooms')
      .populate('eventId', 'title startDate endDate assignedStaff');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const requester = decodeRequester(req);
    if (requester && requester.role === ROLES.STAFF) {
      const staffUser = await UserModel.findById(requester.id);
      const assignedEvents = staffUser?.assignedEvents || [];
      const event = session.eventId;
      const isAssigned = (event?.assignedStaff && event.assignedStaff.some(id => id.toString() === requester.id.toString())) ||
                         assignedEvents.some(id => id.toString() === event?._id.toString());
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view this session.',
          error: { code: 'FORBIDDEN_EVENT_ACCESS' }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Session details retrieved',
      data: { session }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions (Conflict Detection Enforced!)
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['eventId', 'title', 'startTime', 'endTime']), async (req, res, next) => {
  try {
    const { eventId, venueId, roomId, speakerId, startTime, endTime } = req.body;

    if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid eventId format' });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Associated event not found' });
    }

    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create sessions for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    // 1. Room conflict check
    if (roomId) {
      const roomConflict = await checkRoomConflict(SessionModel, {
        eventId,
        venueId,
        roomId,
        startTime,
        endTime
      });

      if (roomConflict) {
        return res.status(409).json({
          success: false,
          message: 'Room is already occupied during this time.',
          error: {
            code: 'ROOM_CONFLICT',
            conflictingSession: roomConflict.title,
            occupiedRange: `${roomConflict.startTime} - ${roomConflict.endTime}`
          }
        });
      }
    }

    // 2. Speaker conflict check
    if (speakerId) {
      const speakerConflict = await checkSpeakerConflict(SessionModel, {
        speakerId,
        startTime,
        endTime
      });

      if (speakerConflict) {
        return res.status(409).json({
          success: false,
          message: 'Speaker is already assigned to another session during this time.',
          error: {
            code: 'SPEAKER_CONFLICT',
            conflictingSession: speakerConflict.title,
            occupiedRange: `${speakerConflict.startTime} - ${speakerConflict.endTime}`
          }
        });
      }
    }

    const session = await SessionModel.create(req.body);
    const populated = await SessionModel.findById(session._id).populate('speakerId').populate('venueId');

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: { session: populated }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sessions/:id
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Associated event not found' });

    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify sessions for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    const eventId = req.body.eventId || session.eventId;
    const venueId = req.body.venueId !== undefined ? req.body.venueId : session.venueId;
    const roomId = req.body.roomId !== undefined ? req.body.roomId : session.roomId;
    const speakerId = req.body.speakerId !== undefined ? req.body.speakerId : session.speakerId;
    const startTime = req.body.startTime || session.startTime;
    const endTime = req.body.endTime || session.endTime;

    if (roomId) {
      const roomConflict = await checkRoomConflict(SessionModel, {
        eventId,
        venueId,
        roomId,
        startTime,
        endTime,
        excludeSessionId: session._id
      });
      if (roomConflict) {
        return res.status(409).json({
          success: false,
          message: 'Room is already occupied during this time.',
          error: { code: 'ROOM_CONFLICT', conflictingSession: roomConflict.title }
        });
      }
    }

    if (speakerId) {
      const speakerConflict = await checkSpeakerConflict(SessionModel, {
        speakerId,
        startTime,
        endTime,
        excludeSessionId: session._id
      });
      if (speakerConflict) {
        return res.status(409).json({
          success: false,
          message: 'Speaker is already assigned to another session during this time.',
          error: { code: 'SPEAKER_CONFLICT', conflictingSession: speakerConflict.title }
        });
      }
    }

    const updated = await SessionModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('speakerId')
      .populate('venueId');

    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: { session: updated }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/materials
router.post('/:id/materials', verifyToken, validateObjectId('id'), async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    const isSpeaker = session.speakerId && session.speakerId.toString() === req.user._id.toString();
    const isOrganizer = isAuthorizedForEvent(event, req.user);

    if (!isSpeaker && !isOrganizer && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to upload materials for this session.',
        error: { code: 'FORBIDDEN_SESSION_ACCESS' }
      });
    }

    const { title, url, fileType = 'pdf' } = req.body;
    session.materials.push({ title, url, fileType, uploadedAt: new Date() });
    await session.save();

    res.status(201).json({
      success: true,
      message: 'Presentation material uploaded successfully',
      data: { materials: session.materials }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete sessions for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    await SessionModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/sessions/:sessionId/materials/:materialId/review - Review speaker presentation
router.patch('/:sessionId/materials/:materialId/review', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('sessionId'), async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const session = await SessionModel.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const event = await EventModel.findById(session.eventId);
    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review materials for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    const material = session.materials.id(req.params.materialId);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    material.status = status || 'Approved';
    material.updatedAt = new Date();
    if (notes) material.description = notes;
    await session.save();

    res.status(200).json({
      success: true,
      message: `Presentation status updated: ${material.status}`,
      data: { material }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
