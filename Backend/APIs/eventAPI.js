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
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { ROLES, EVENT_STATUS } = require('../utils/constants');
const { checkVenueConflict } = require('../utils/validateSchedule');

// GET /api/events (Public browsing & filtered dashboard views)
router.get('/', async (req, res, next) => {
  try {
    const { search, category, status, organizationId, eventType, page = 1, limit = 20 } = req.query;
    const query = {};

    let requester = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        requester = jwt.verify(token, process.env.JWT_SECRET);
      } catch (e) {
        requester = null;
      }
    }

    const andClauses = [];
    if (requester && requester.role === ROLES.STAFF) {
      const staffUser = await UserModel.findById(requester.id);
      const assignedEvents = staffUser?.assignedEvents || [];
      andClauses.push({
        $or: [
          { assignedStaff: requester.id },
          { _id: { $in: assignedEvents } }
        ]
      });
    } else if (status) {
      query.status = status;
    } else if (!req.headers.authorization) {
      // Public browsing only sees published or ongoing
      query.status = { $in: [EVENT_STATUS.PUBLISHED, EVENT_STATUS.ONGOING] };
    }

    if (search) {
      andClauses.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      });
    }

    if (andClauses.length > 0) {
      query.$and = andClauses;
    }
    if (category) query.category = category;
    if (eventType) query.eventType = eventType;
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

    // Venue conflict detection: Check if another event occupies the same venue at the same time
    if (req.body.venueId) {
      const conflict = await checkVenueConflict(EventModel, {
        venueId: req.body.venueId,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      });
      if (conflict) {
        const venueName = conflict.venueId?.name || 'this venue';
        return res.status(409).json({
          success: false,
          message: `Venue Conflict: Another event ("${conflict.title}") is already scheduled at ${venueName} from ${new Date(conflict.startDate).toLocaleDateString()} to ${new Date(conflict.endDate).toLocaleDateString()}.`,
          error: {
            code: 'VENUE_CONFLICT',
            conflictingEvent: conflict.title,
            venueName,
            startDate: conflict.startDate,
            endDate: conflict.endDate
          }
        });
      }
    }

    const registrationEnd = req.body.registrationEnd || req.body.endDate;
    const registrationStart = req.body.registrationStart || req.body.startDate || Date.now();

    const event = await EventModel.create({
      ...req.body,
      registrationStart,
      registrationEnd,
      organizationId: orgId,
      organizerId: req.user._id,
      status: req.body.status || EVENT_STATUS.DRAFT
    });

    // Provision tickets if supplied, or create standard delegate pass
    if (Array.isArray(req.body.tickets) && req.body.tickets.length > 0) {
      for (const t of req.body.tickets) {
        if (t.name) {
          await TicketModel.create({
            eventId: event._id,
            name: t.name,
            price: Number(t.price) || 0,
            quantity: Number(t.quantity) || 100,
            sold: 0,
            remaining: Number(t.quantity) || 100,
            description: t.description || 'Conference admission pass',
            saleStart: t.salesStart || t.saleStart || registrationStart,
            saleEnd: t.salesEnd || t.saleEnd || registrationEnd,
            benefits: t.benefits || ['Conference Admission', 'Keynote & Session Access'],
            status: 'active'
          });
        }
      }
    } else {
      await TicketModel.create({
        eventId: event._id,
        name: 'General Delegate Pass',
        price: 0,
        quantity: event.capacity || 1000,
        sold: 0,
        remaining: event.capacity || 1000,
        saleStart: registrationStart,
        saleEnd: registrationEnd,
        benefits: ['Full Conference Access', 'Keynotes & General Sessions', 'Digital Attendance Badge'],
        status: 'active'
      });
    }

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
    const existing = await EventModel.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Event not found' });

    const venueId = req.body.venueId !== undefined ? req.body.venueId : existing.venueId;
    const startDate = req.body.startDate || existing.startDate;
    const endDate = req.body.endDate || existing.endDate;

    if (venueId) {
      const conflict = await checkVenueConflict(EventModel, {
        venueId,
        startDate,
        endDate,
        excludeEventId: existing._id
      });
      if (conflict) {
        const venueName = conflict.venueId?.name || 'this venue';
        return res.status(409).json({
          success: false,
          message: `Venue Conflict: Another event ("${conflict.title}") is already scheduled at ${venueName} from ${new Date(conflict.startDate).toLocaleDateString()} to ${new Date(conflict.endDate).toLocaleDateString()}.`,
          error: {
            code: 'VENUE_CONFLICT',
            conflictingEvent: conflict.title,
            venueName,
            startDate: conflict.startDate,
            endDate: conflict.endDate
          }
        });
      }
    }

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
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // If publishing, verify venue availability
    if (event.status !== EVENT_STATUS.PUBLISHED && event.venueId) {
      const conflict = await checkVenueConflict(EventModel, {
        venueId: event.venueId,
        startDate: event.startDate,
        endDate: event.endDate,
        excludeEventId: event._id
      });
      if (conflict) {
        const venueName = conflict.venueId?.name || 'this venue';
        return res.status(409).json({
          success: false,
          message: `Venue Conflict: Cannot publish event. "${conflict.title}" is already scheduled at ${venueName} during this time range.`,
          error: {
            code: 'VENUE_CONFLICT',
            conflictingEvent: conflict.title,
            venueName,
            startDate: conflict.startDate,
            endDate: conflict.endDate
          }
        });
      }
    }

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

// GET /api/events/:id/staff
router.get('/:id/staff', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id)
      .populate('assignedStaff', 'name email phone role profileImage department');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.status(200).json({
      success: true,
      message: 'Assigned staff retrieved',
      data: { staff: event.assignedStaff || [] }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/events/:id/staff
router.post('/:id/staff', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, validateRequest(['staffId']), async (req, res, next) => {
  try {
    const { staffId } = req.body;
    const staffUser = await UserModel.findOne({ _id: staffId, role: ROLES.STAFF });
    if (!staffUser) {
      return res.status(404).json({ success: false, message: 'Staff user not found.' });
    }

    const event = await EventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Add to event.assignedStaff if not already present
    if (!event.assignedStaff) event.assignedStaff = [];
    if (!event.assignedStaff.some(id => id.toString() === staffId.toString())) {
      event.assignedStaff.push(staffId);
      await event.save();
    }

    // Add to user.assignedEvents if not already present
    if (!staffUser.assignedEvents) staffUser.assignedEvents = [];
    if (!staffUser.assignedEvents.some(id => id.toString() === event._id.toString())) {
      staffUser.assignedEvents.push(event._id);
      await staffUser.save();
    }

    const updatedEvent = await EventModel.findById(req.params.id).populate('assignedStaff', 'name email phone role');

    res.status(200).json({
      success: true,
      message: 'Staff assigned to event successfully',
      data: { staff: updatedEvent.assignedStaff }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id/staff/:staffId
router.delete('/:id/staff/:staffId', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), verifyEventAccess, async (req, res, next) => {
  try {
    const { id, staffId } = req.params;
    const event = await EventModel.findById(id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.assignedStaff) {
      event.assignedStaff = event.assignedStaff.filter(sId => sId.toString() !== staffId.toString());
      await event.save();
    }

    await UserModel.findByIdAndUpdate(staffId, {
      $pull: { assignedEvents: event._id }
    });

    res.status(200).json({
      success: true,
      message: 'Staff member removed from event',
      data: { staff: event.assignedStaff }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
