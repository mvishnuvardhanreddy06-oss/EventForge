const express = require('express');
const router = express.Router();
const EventModel = require('../models/EventModel');
const TicketModel = require('../models/TicketModel');
const SessionModel = require('../models/SessionModel');
const VenueModel = require('../models/VenueModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const verifyEventAccess = require('../middlewares/verifyEventAccess');
const validateRequest = require('../middlewares/validateRequest');
const validateObjectId = require('../middlewares/validateObjectId');
const { ROLES, EVENT_STATUS } = require('../utils/constants');

// GET /api/events (Public browsing & filtered dashboard views)
router.get('/', async (req, res, next) => {
  try {
    const { search, category, status, organizationId, eventType, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (category) query.category = category;
    if (eventType) query.eventType = eventType;
    if (status) {
      query.status = status;
    } else if (!req.headers.authorization) {
      // Public browsing only sees published or ongoing
      query.status = { $in: [EVENT_STATUS.PUBLISHED, EVENT_STATUS.ONGOING] };
    }
    if (organizationId) query.organizationId = organizationId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await EventModel.find(query)
      .populate('organizationId', 'name logo')
      .populate('venueId', 'name city address')
      .populate('organizerId', 'name email')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EventModel.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id
router.get('/:id', validateObjectId('id'), async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id)
      .populate('organizationId')
      .populate('venueId')
      .populate('organizerId', 'name email profileImage');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const tickets = await TicketModel.find({ eventId: event._id, status: 'active' });
    const sessions = await SessionModel.find({ eventId: event._id, status: { $ne: 'cancelled' } })
      .populate('speakerId')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      message: 'Event details retrieved',
      data: {
        event,
        tickets,
        sessions
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/events (Organizer, Admin)
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['title', 'category', 'startDate', 'endDate', 'capacity']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    if (!orgId && req.user.role !== ROLES.ADMIN) {
      return res.status(400).json({ success: false, message: 'Organizer must be associated with an organization to create events.' });
    }

    const event = await EventModel.create({
      ...req.body,
      organizationId: orgId,
      organizerId: req.user._id,
      status: req.body.status || EVENT_STATUS.DRAFT
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/events/:id (Organizer, Admin with event access)
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, async (req, res, next) => {
  try {
    const updated = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updated }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/events/:id/publish
router.patch('/:id/publish', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id);
    event.status = event.status === EVENT_STATUS.PUBLISHED ? EVENT_STATUS.DRAFT : EVENT_STATUS.PUBLISHED;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event status changed to ${event.status}`,
      data: { event }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/events/:id/status
router.patch('/:id/status', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Object.values(EVENT_STATUS).includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid event status value.' });
    }
    const event = await EventModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({
      success: true,
      message: `Event status updated to ${status}`,
      data: { event }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, async (req, res, next) => {
  try {
    await EventModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
