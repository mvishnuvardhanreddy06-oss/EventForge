const express = require('express');
const router = express.Router();
const SessionModel = require('../models/SessionModel');
const { checkRoomConflict, checkSpeakerConflict } = require('../utils/validateSchedule');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/sessions
router.get('/', async (req, res, next) => {
  try {
    const { eventId, speakerId, category, roomId } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;
    if (speakerId) query.speakerId = speakerId;
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
router.get('/:id', async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id)
      .populate('speakerId')
      .populate('venueId')
      .populate('eventId', 'title startDate endDate');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
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
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

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
router.post('/:id/materials', verifyToken, async (req, res, next) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

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
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
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

module.exports = router;
