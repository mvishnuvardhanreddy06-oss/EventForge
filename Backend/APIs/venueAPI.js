const express = require('express');
const router = express.Router();
const VenueModel = require('../models/VenueModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

const EventModel = require('../models/EventModel');
const { checkVenueConflict } = require('../utils/validateSchedule');

// GET /api/venues/conflicts/all - Scan all venues for schedule collisions
router.get('/conflicts/all', async (req, res, next) => {
  try {
    const events = await EventModel.find({
      venueId: { $ne: null },
      status: { $in: ['published', 'ongoing'] }
    }).populate('venueId', 'name city address');

    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];
        if (a.venueId && b.venueId && a.venueId._id.toString() === b.venueId._id.toString()) {
          const startA = new Date(a.startDate).getTime();
          const endA = new Date(a.endDate).getTime();
          const startB = new Date(b.startDate).getTime();
          const endB = new Date(b.endDate).getTime();

          // Time overlap check: startA < endB && endA > startB
          if (startA < endB && endA > startB) {
            conflicts.push({
              venueId: a.venueId._id,
              venueName: a.venueId.name,
              event1: {
                id: a._id,
                title: a.title,
                startDate: a.startDate,
                endDate: a.endDate,
                status: a.status
              },
              event2: {
                id: b._id,
                title: b.title,
                startDate: b.startDate,
                endDate: b.endDate,
                status: b.status
              }
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      totalConflicts: conflicts.length,
      conflicts,
      message: conflicts.length === 0
        ? 'All venues checked. Zero schedule collisions detected.'
        : `Detected ${conflicts.length} venue schedule collision(s).`
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/venues
router.get('/', async (req, res, next) => {
  try {
    const { organizationId, eventId, city } = req.query;
    const query = {};
    if (organizationId) query.organizationId = organizationId;
    if (eventId) query.eventId = eventId;
    if (city) query.city = new RegExp(city, 'i');

    const venues = await VenueModel.find(query).sort({ name: 1 });
    const venueIds = venues.map(v => v._id);

    // Fetch all active events assigned to these venues
    const events = await EventModel.find({
      venueId: { $in: venueIds },
      status: { $in: ['published', 'ongoing'] }
    }).sort({ startDate: 1 });

    const now = new Date();

    const enriched = venues.map(v => {
      const venueEvents = events.filter(e => e.venueId.toString() === v._id.toString());
      const currentEv = venueEvents.find(e => new Date(e.startDate) <= now && new Date(e.endDate) >= now);

      const bookings = venueEvents.map(e => ({
        id: e._id,
        title: e.title,
        date: e.startDate ? new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
        time: '09:00 AM – 06:00 PM',
        startDate: e.startDate,
        endDate: e.endDate,
        room: v.rooms && v.rooms.length > 0 ? v.rooms[0].name : 'Main Plenary Hall',
        status: e.status
      }));

      // Check if this venue has any conflicting overlapping events
      let hasConflict = false;
      const conflictingBookings = [];
      for (let i = 0; i < venueEvents.length; i++) {
        for (let j = i + 1; j < venueEvents.length; j++) {
          const a = venueEvents[i];
          const b = venueEvents[j];
          if (new Date(a.startDate) < new Date(b.endDate) && new Date(a.endDate) > new Date(b.startDate)) {
            hasConflict = true;
            conflictingBookings.push({ eventA: a.title, eventB: b.title });
          }
        }
      }

      return {
        ...v.toObject(),
        status: currentEv ? 'booked' : (v.status || 'available'),
        currentEvent: currentEv ? {
          title: currentEv.title,
          date: new Date(currentEv.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        } : null,
        upcomingBookings: bookings,
        hasConflict,
        conflictingBookings
      };
    });

    res.status(200).json({
      success: true,
      message: 'Venues retrieved successfully',
      data: { venues: enriched }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/venues/:id
router.get('/:id', async (req, res, next) => {
  try {
    const venue = await VenueModel.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.status(200).json({
      success: true,
      message: 'Venue details retrieved',
      data: { venue }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/venues/:id/check-availability
router.get('/:id/check-availability', async (req, res, next) => {
  try {
    const venue = await VenueModel.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });

    const { startDate, endDate, excludeEventId } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'startDate and endDate query parameters are required' });
    }

    const conflict = await checkVenueConflict(EventModel, {
      venueId: req.params.id,
      startDate,
      endDate,
      excludeEventId
    });

    if (conflict) {
      return res.status(200).json({
        success: true,
        available: false,
        conflict: {
          conflictingEvent: conflict.title,
          eventId: conflict._id,
          venueName: venue.name,
          startDate: conflict.startDate,
          endDate: conflict.endDate
        },
        message: `Venue "${venue.name}" is already booked for "${conflict.title}" during this time window.`
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: `Venue "${venue.name}" is available for the selected dates.`
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/venues/:id/bookings
router.get('/:id/bookings', async (req, res, next) => {
  try {
    const venue = await VenueModel.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });

    const events = await EventModel.find({
      venueId: req.params.id,
      status: { $in: ['published', 'ongoing', 'draft'] }
    }).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        venue,
        bookings: events.map(e => ({
          id: e._id,
          title: e.title,
          status: e.status,
          startDate: e.startDate,
          endDate: e.endDate,
          capacity: e.capacity
        }))
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/venues
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['name', 'address', 'city', 'capacity']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    const venue = await VenueModel.create({
      ...req.body,
      organizationId: orgId
    });

    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: { venue }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/venues/:id
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const updated = await VenueModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: { venue: updated }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/venues/:id/rooms (Add room to venue)
router.post('/:id/rooms', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['name', 'capacity']), async (req, res, next) => {
  try {
    const venue = await VenueModel.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });

    venue.rooms.push(req.body);
    await venue.save();

    res.status(201).json({
      success: true,
      message: 'Room added to venue successfully',
      data: { venue }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/venues/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    await VenueModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
