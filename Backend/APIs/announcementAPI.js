const express = require('express');
const router = express.Router();
const AnnouncementModel = require('../models/AnnouncementModel');
const RegistrationModel = require('../models/RegistrationModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { broadcastEventNotification } = require('../services/notificationService');
const { ROLES } = require('../utils/constants');

// GET /api/announcements
router.get('/', async (req, res, next) => {
  try {
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ success: false, message: 'eventId query parameter is required' });

    const announcements = await AnnouncementModel.find({ eventId })
      .populate('createdBy', 'name')
      .sort({ publishedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Announcements retrieved',
      data: { announcements }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/announcements (Create & broadcast)
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['eventId', 'title', 'message']), async (req, res, next) => {
  try {
    const { eventId, title, message, type = 'general' } = req.body;

    const announcement = await AnnouncementModel.create({
      eventId,
      title,
      message,
      type,
      createdBy: req.user._id
    });

    // Find confirmed attendees of this event to dispatch notification
    const registrations = await RegistrationModel.find({
      eventId,
      status: 'confirmed'
    }).select('attendeeId');

    const attendeeUserIds = registrations.map(r => r.attendeeId);

    // Real-time broadcast and persist notification
    await broadcastEventNotification({
      eventId,
      title,
      message,
      type,
      attendeeUserIds
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published and broadcasted successfully',
      data: { announcement }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    await AnnouncementModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Announcement removed',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
