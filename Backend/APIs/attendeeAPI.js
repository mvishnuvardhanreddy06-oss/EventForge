const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const SessionModel = require('../models/SessionModel');
const TicketModel = require('../models/TicketModel');
const RegistrationModel = require('../models/RegistrationModel');
const AttendanceModel = require('../models/AttendanceModel');
const FeedbackModel = require('../models/FeedbackModel');
const NotificationModel = require('../models/NotificationModel');
const AnnouncementModel = require('../models/AnnouncementModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { generateQRToken, createRegistrationQR } = require('../services/qrService');
const { ROLES } = require('../utils/constants');

// ============================================================
// ATTENDEE PORTAL ENDPOINTS (/api/attendee/*)
// Protected: verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN)
// ============================================================

// 1. GET /api/attendee/dashboard - Summary metrics, next session, active ticket, announcements
router.get('/dashboard', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const attendeeId = req.user._id;

    // Fetch confirmed registrations
    const registrations = await RegistrationModel.find({
      attendeeId,
      status: { $ne: 'cancelled' }
    })
      .populate({
        path: 'eventId',
        select: 'title startDate endDate bannerImage venueId status',
        populate: { path: 'venueId', select: 'name city' }
      })
      .populate('ticketId', 'name price')
      .sort({ createdAt: -1 });

    const activeTicketsCount = registrations.filter(r => r.status === 'confirmed').length;

    // Registered Event IDs
    const eventIds = [...new Set(registrations.map(r => r.eventId?._id).filter(Boolean))];
    const now = new Date();

    // Upcoming registered events
    const upcomingEvents = registrations
      .filter(r => r.eventId && new Date(r.eventId.endDate) >= now)
      .map(r => ({
        registrationId: r._id,
        eventId: r.eventId._id,
        title: r.eventId.title,
        date: r.eventId.startDate ? new Date(r.eventId.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
        time: r.eventId.startDate ? new Date(r.eventId.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
        venue: r.eventId.venueId?.name || 'Convention Centre',
        city: r.eventId.venueId?.city || 'Hyderabad',
        ticketType: r.ticketId?.name || 'General Pass',
        status: r.status === 'confirmed' ? 'Registered' : r.status
      }));

    // Find upcoming sessions across registered events
    const upcomingSessions = await SessionModel.find({
      eventId: { $in: eventIds },
      endTime: { $gte: now },
      status: { $ne: 'cancelled' }
    })
      .populate('speakerId', 'name designation company profileImage')
      .populate('venueId', 'name')
      .sort({ startTime: 1 });

    const nextSessionDoc = upcomingSessions[0] || null;
    let nextSession = null;
    if (nextSessionDoc) {
      nextSession = {
        _id: nextSessionDoc._id,
        title: nextSessionDoc.title,
        time: nextSessionDoc.startTime && nextSessionDoc.endTime
          ? `${new Date(nextSessionDoc.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(nextSessionDoc.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : '10:00 AM – 11:00 AM',
        room: nextSessionDoc.roomName || 'Hall A',
        speaker: nextSessionDoc.speakerId?.name || 'Keynote Speaker',
        category: nextSessionDoc.category || 'Keynote'
      };
    }

    // Active primary ticket
    const primaryReg = registrations.find(r => r.status === 'confirmed') || registrations[0] || null;
    let activeTicket = null;
    if (primaryReg) {
      activeTicket = {
        registrationId: primaryReg._id,
        eventTitle: primaryReg.eventId?.title || 'Global Tech Summit 2026',
        ticketType: primaryReg.ticketId?.name || 'VIP',
        ticketId: primaryReg.registrationNumber || 'EVF-VIP-002481',
        status: primaryReg.checkedIn ? 'Used' : 'Confirmed'
      };
    }

    // Pending feedback count
    const attendedEvents = registrations.filter(r => r.checkedIn).map(r => r.eventId?._id);
    const existingFeedback = await FeedbackModel.find({ attendeeId });
    const feedbackEventIds = existingFeedback.map(f => f.eventId.toString());
    const pendingFeedbackCount = Math.max(0, attendedEvents.filter(id => id && !feedbackEventIds.includes(id.toString())).length);

    // Recent announcements from registered events or general
    const announcements = await AnnouncementModel.find({
      $or: [
        { eventId: { $in: eventIds } },
        { type: 'general' }
      ]
    })
      .populate('eventId', 'title')
      .sort({ publishedAt: -1 })
      .limit(3);

    const mappedAnnouncements = announcements.map(a => ({
      _id: a._id,
      title: a.title,
      message: a.message,
      eventTitle: a.eventId?.title || 'EventForge Summit',
      date: new Date(a.publishedAt || a.createdAt).toLocaleDateString(),
      time: new Date(a.publishedAt || a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: a.priority || 'medium'
    }));

    res.status(200).json({
      success: true,
      message: 'Attendee dashboard data retrieved',
      data: {
        summary: {
          upcomingEvents: upcomingEvents.length,
          activeTickets: activeTicketsCount,
          upcomingSessions: upcomingSessions.length,
          pendingFeedback: pendingFeedbackCount || (attendedEvents.length === 0 ? 1 : 0)
        },
        upcomingEvents: upcomingEvents.slice(0, 4),
        nextSession,
        activeTicket,
        recentAnnouncements: mappedAnnouncements
      }
    });
  } catch (err) {
    next(err);
  }
});

// 2. GET /api/attendee/events - Discover Events (Search, Filters, Sort)
router.get('/events', async (req, res, next) => {
  try {
    const {
      search,
      category,
      location,
      eventType,
      price,
      availability,
      sortBy = 'recommended'
    } = req.query;

    const query = { status: { $in: ['published', 'ongoing'] } };

    if (category && category !== 'All') {
      query.category = new RegExp(category, 'i');
    }

    const events = await EventModel.find(query)
      .populate('venueId', 'name city address capacity')
      .populate('organizationId', 'name')
      .sort({ startDate: 1 });

    // Fetch tickets for all events to determine starting prices & seat availability
    const eventIds = events.map(e => e._id);
    const tickets = await TicketModel.find({ eventId: { $in: eventIds } });

    let enriched = events.map(ev => {
      const evTickets = tickets.filter(t => t.eventId.toString() === ev._id.toString());
      const minPrice = evTickets.length > 0 ? Math.min(...evTickets.map(t => t.price)) : 0;
      const totalAvailable = evTickets.reduce((acc, t) => acc + (t.remaining || 0), 0);
      const isSoldOut = evTickets.length > 0 && totalAvailable === 0;

      let eventStatus = 'Registration Open';
      if (ev.status === 'ongoing') eventStatus = 'Live';
      else if (isSoldOut) eventStatus = 'Sold Out';
      else if (totalAvailable > 0 && totalAvailable < 50) eventStatus = 'Almost Full';

      return {
        _id: ev._id,
        title: ev.title,
        description: ev.description,
        category: ev.category || 'Technology',
        bannerImage: ev.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        startDate: ev.startDate,
        endDate: ev.endDate,
        date: ev.startDate ? new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming',
        time: ev.startDate ? new Date(ev.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
        venue: ev.venueId?.name || 'Convention Centre',
        city: ev.venueId?.city || 'Hyderabad',
        organizer: ev.organizationId?.name || 'EventForge Global',
        startingPrice: minPrice,
        priceDisplay: minPrice === 0 ? 'Free' : `₹${minPrice.toLocaleString('en-IN')}`,
        availableSeats: totalAvailable || 250,
        eventStatus
      };
    });

    // Apply Client Search
    if (search) {
      const q = search.toLowerCase();
      enriched = enriched.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }

    // Apply Location filter
    if (location && location !== 'All') {
      enriched = enriched.filter(e => e.city.toLowerCase().includes(location.toLowerCase()));
    }

    // Apply Price filter
    if (price === 'free') {
      enriched = enriched.filter(e => e.startingPrice === 0);
    } else if (price === 'paid') {
      enriched = enriched.filter(e => e.startingPrice > 0);
    }

    // Apply Availability filter
    if (availability === 'available') {
      enriched = enriched.filter(e => e.eventStatus !== 'Sold Out');
    }

    // Apply Sorting
    if (sortBy === 'price_low_to_high') {
      enriched.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price_high_to_low') {
      enriched.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'date') {
      enriched.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortBy === 'newest') {
      enriched.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    res.status(200).json({
      success: true,
      message: 'Events retrieved for discovery',
      data: { events: enriched }
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/attendee/events/:eventId - Granular Event Details with speakers, sessions, tickets & registration status
router.get('/events/:eventId', async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.eventId)
      .populate('venueId')
      .populate('organizationId', 'name description email');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Fetch sessions
    const sessions = await SessionModel.find({ eventId: event._id })
      .populate('speakerId', 'name designation company profileImage bio')
      .populate('venueId', 'name')
      .sort({ startTime: 1 });

    // Fetch speakers (deduped from sessions)
    const speakerMap = new Map();
    sessions.forEach(s => {
      if (s.speakerId && !speakerMap.has(s.speakerId._id.toString())) {
        speakerMap.set(s.speakerId._id.toString(), {
          _id: s.speakerId._id,
          name: s.speakerId.name,
          designation: s.speakerId.designation,
          company: s.speakerId.company,
          profileImage: s.speakerId.profileImage,
          bio: s.speakerId.bio,
          sessionTitle: s.title
        });
      }
    });
    const speakers = Array.from(speakerMap.values());

    // Fetch tickets
    let tickets = await TicketModel.find({ eventId: event._id });
    if (tickets.length === 0) {
      const defaultTicket = await TicketModel.create({
        eventId: event._id,
        name: 'General Delegate Pass',
        price: 0,
        quantity: event.capacity || 1000,
        sold: 0,
        remaining: event.capacity || 1000,
        saleStart: event.registrationStart || Date.now(),
        saleEnd: event.registrationEnd || event.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        benefits: ['Full Conference Access', 'Keynotes & General Sessions', 'Digital Attendance Badge'],
        status: 'active'
      });
      tickets = [defaultTicket];
    }

    // Check if authenticated user is registered
    let userRegistration = null;
    if (req.headers.authorization) {
      try {
        // Soft token decode if provided
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventforge_secret_2026');
        if (decoded && decoded.id) {
          userRegistration = await RegistrationModel.findOne({
            eventId: event._id,
            attendeeId: decoded.id,
            status: 'confirmed'
          }).populate('ticketId', 'name');
        }
      } catch (e) {
        // unauthenticated browsing is allowed
      }
    }

    res.status(200).json({
      success: true,
      message: 'Event details retrieved',
      data: {
        event,
        speakers,
        sessions,
        tickets,
        highlights: {
          sessionCount: sessions.length,
          speakerCount: speakers.length,
          capacity: event.capacity || event.venueId?.capacity || 1000
        },
        registration: userRegistration ? {
          isRegistered: true,
          registrationId: userRegistration._id,
          ticketName: userRegistration.ticketId?.name,
          registrationNumber: userRegistration.registrationNumber
        } : { isRegistered: false }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 4. POST /api/attendee/register and POST /api/attendee/events/:id/register
router.post(['/register', '/events/:id/register'], verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const eventId = req.params.id || req.body.eventId;
    const { ticketId, phone, attendeeName } = req.body;
    const attendeeId = req.user._id;

    if (!eventId || !ticketId) {
      return res.status(400).json({ success: false, message: 'eventId and ticketId are required.' });
    }

    // Validate Indian Phone Number format (+91 followed by 10 digits)
    if (phone) {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      const indianPhoneRegex = /^(\+91)?[6789]\d{9}$/;
      if (!indianPhoneRegex.test(cleanPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid Indian mobile number (+91 followed by 10 digits starting with 6-9).'
        });
      }
    }

    // Check if already registered
    const existingReg = await RegistrationModel.findOne({
      eventId,
      attendeeId,
      status: 'confirmed'
    });
    if (existingReg) {
      return res.status(409).json({
        success: false,
        message: 'You are already registered for this event.',
        data: { registrationId: existingReg._id, registrationNumber: existingReg.registrationNumber }
      });
    }

    // Verify Ticket Availability
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Selected ticket tier not found' });
    }
    if (ticket.remaining <= 0) {
      return res.status(400).json({ success: false, message: 'This ticket tier is sold out.' });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Generate unique Ticket ID (e.g. EVF-VIP-002481)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const tierCode = (ticket.name.includes('VIP') ? 'VIP' : 'GEN');
    const registrationNumber = `EVF-${tierCode}-${randomSuffix}`;

    // Generate secure QR token
    const qrToken = generateQRToken(registrationNumber, eventId, attendeeId);
    const qrCodeUrl = await createRegistrationQR(qrToken, registrationNumber, event.title);

    // Create registration
    const registration = await RegistrationModel.create({
      eventId,
      attendeeId,
      ticketId,
      registrationNumber,
      status: 'confirmed',
      paymentStatus: ticket.price === 0 ? 'free' : 'paid',
      finalAmount: ticket.price,
      qrToken,
      qrCodeUrl,
      registeredAt: new Date()
    });

    // Decrement ticket remaining slot
    ticket.sold = (ticket.sold || 0) + 1;
    ticket.remaining = Math.max(0, ticket.quantity - ticket.sold);
    if (ticket.remaining === 0) ticket.status = 'sold_out';
    await ticket.save();

    // Update attendee phone if provided
    if (phone) {
      await UserModel.findByIdAndUpdate(attendeeId, { phone });
    }

    // Create confirmation notification
    await NotificationModel.create({
      userId: attendeeId,
      eventId,
      title: 'Registration Confirmed',
      message: `Your pass for "${event.title}" (${ticket.name}) is confirmed. Ticket ID: ${registrationNumber}.`,
      type: 'registration'
    });

    res.status(201).json({
      success: true,
      message: 'Registration completed successfully!',
      data: {
        registration,
        registrationId: registration._id,
        registrationNumber,
        qrToken,
        qrCodeUrl,
        eventTitle: event.title,
        ticketType: ticket.name,
        amount: ticket.price
      }
    });
  } catch (err) {
    next(err);
  }
});

// 5. GET /api/attendee/registrations - Attendee's registration history
router.get('/registrations', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { attendeeId: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const registrations = await RegistrationModel.find(query)
      .populate({
        path: 'eventId',
        select: 'title startDate endDate bannerImage venueId',
        populate: { path: 'venueId', select: 'name city address' }
      })
      .populate('ticketId', 'name price benefits')
      .sort({ createdAt: -1 });

    const formatted = registrations.map(r => ({
      _id: r._id,
      registrationNumber: r.registrationNumber,
      eventTitle: r.eventId?.title || 'Global Tech Summit',
      eventDate: r.eventId?.startDate ? new Date(r.eventId.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'September 24, 2026',
      venue: r.eventId?.venueId?.name || 'Convention Centre',
      city: r.eventId?.venueId?.city || 'Hyderabad',
      ticketType: r.ticketId?.name || 'VIP Pass',
      ticketPrice: r.ticketId?.price || 0,
      paymentStatus: r.paymentStatus || 'paid',
      registrationStatus: r.status || 'confirmed',
      registeredAt: new Date(r.registeredAt || r.createdAt).toLocaleDateString(),
      checkedIn: Boolean(r.checkedIn)
    }));

    res.status(200).json({
      success: true,
      message: 'Registrations retrieved',
      data: { registrations: formatted }
    });
  } catch (err) {
    next(err);
  }
});

// 6. GET /api/attendee/tickets and GET /api/attendee/tickets/:registrationId
router.get(['/tickets', '/tickets/:registrationId'], verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { registrationId } = req.params;
    const query = {
      attendeeId: req.user._id,
      status: 'confirmed'
    };
    if (registrationId) {
      query._id = registrationId;
    }

    const registrations = await RegistrationModel.find(query)
      .populate({
        path: 'eventId',
        select: 'title startDate endDate venueId bannerImage',
        populate: { path: 'venueId', select: 'name city address' }
      })
      .populate('ticketId', 'name price benefits')
      .sort({ createdAt: -1 });

    const tickets = registrations.map(r => ({
      _id: r._id,
      ticketId: r.registrationNumber,
      ticketType: r.ticketId?.name || 'General Pass',
      attendeeName: req.user.name,
      attendeeEmail: req.user.email,
      eventTitle: r.eventId?.title || 'Global Tech Summit 2026',
      eventDate: r.eventId?.startDate ? new Date(r.eventId.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 24, 2026',
      eventTime: r.eventId?.startDate ? new Date(r.eventId.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
      venue: r.eventId?.venueId?.name || 'Hyderabad International Convention Centre',
      address: r.eventId?.venueId?.address || 'HITEC City',
      city: r.eventId?.venueId?.city || 'Hyderabad',
      qrToken: r.qrToken,
      qrCodeUrl: r.qrCodeUrl,
      status: r.checkedIn ? 'Used' : 'Confirmed',
      checkedInAt: r.checkedInAt
    }));

    if (registrationId && tickets.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Ticket details retrieved',
        data: {
          ticket: tickets[0],
          qrToken: tickets[0].qrToken,
          qrCodeUrl: tickets[0].qrCodeUrl,
          tickets
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tickets retrieved',
      data: { tickets }
    });
  } catch (err) {
    next(err);
  }
});

// 7. GET /api/attendee/schedule - Personal Schedule of Selected Sessions
router.get('/schedule', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: 'personalSchedule',
      populate: [
        { path: 'speakerId', select: 'name designation company profileImage' },
        { path: 'venueId', select: 'name' },
        { path: 'eventId', select: 'title startDate endDate' }
      ]
    });

    const sessions = user.personalSchedule || [];
    sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // Check for any schedule conflicts
    const conflicts = [];
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const s1 = sessions[i];
        const s2 = sessions[j];
        if (s1.startTime < s2.endTime && s2.startTime < s1.endTime) {
          conflicts.push({
            sessionA: { id: s1._id, title: s1.title },
            sessionB: { id: s2._id, title: s2.title },
            timeA: `${new Date(s1.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s1.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            timeB: `${new Date(s2.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s2.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Personal schedule retrieved',
      data: {
        schedule: sessions,
        conflicts
      }
    });
  } catch (err) {
    next(err);
  }
});

// 8. POST /api/attendee/schedule/add - Add Session to Personal Schedule with Conflict Detection
router.post('/schedule/add', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), validateRequest(['sessionId']), async (req, res, next) => {
  try {
    const { sessionId, forceAdd = false } = req.body;
    const sessionToAdd = await SessionModel.findById(sessionId);
    if (!sessionToAdd) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const user = await UserModel.findById(req.user._id).populate('personalSchedule');
    const schedule = user.personalSchedule || [];

    // Already in schedule?
    if (schedule.some(s => s._id.toString() === sessionId)) {
      return res.status(400).json({ success: false, message: 'This session is already in your schedule.' });
    }

    // Conflict detection: Check time overlap with existing sessions
    let conflictingSession = null;
    for (const s of schedule) {
      if (s.startTime < sessionToAdd.endTime && sessionToAdd.startTime < s.endTime) {
        conflictingSession = s;
        break;
      }
    }

    if (conflictingSession && !forceAdd) {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: `Schedule Conflict: You already have "${conflictingSession.title}" at this time.`,
        data: {
          conflictingSession: {
            _id: conflictingSession._id,
            title: conflictingSession.title,
            time: `${new Date(conflictingSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(conflictingSession.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          },
          incomingSession: {
            _id: sessionToAdd._id,
            title: sessionToAdd.title,
            time: `${new Date(sessionToAdd.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(sessionToAdd.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          }
        }
      });
    }

    // Add to schedule
    user.personalSchedule.push(sessionToAdd._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: `"${sessionToAdd.title}" added to your schedule.`,
      data: { scheduleCount: user.personalSchedule.length }
    });
  } catch (err) {
    next(err);
  }
});

// 9. POST /api/attendee/schedule/remove - Remove Session from Personal Schedule
router.post('/schedule/remove', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), validateRequest(['sessionId']), async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { personalSchedule: sessionId }
    });

    res.status(200).json({
      success: true,
      message: 'Session removed from your schedule.'
    });
  } catch (err) {
    next(err);
  }
});

// 10. GET /api/attendee/sessions - Browse Sessions across registered events with Attendance Tracking
router.get('/sessions', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { filter = 'all' } = req.query;
    const registrations = await RegistrationModel.find({
      attendeeId: req.user._id,
      status: 'confirmed'
    });
    const eventIds = registrations.map(r => r.eventId);

    const query = { eventId: { $in: eventIds }, status: { $ne: 'cancelled' } };
    const now = new Date();

    if (filter === 'upcoming') {
      query.endTime = { $gte: now };
    } else if (filter === 'completed') {
      query.endTime = { $lt: now };
    }

    const sessions = await SessionModel.find(query)
      .populate('eventId', 'title')
      .populate('speakerId', 'name designation company profileImage')
      .populate('venueId', 'name')
      .sort({ startTime: 1 });

    // Fetch user's attendance records
    const attendanceRecords = await AttendanceModel.find({ attendeeId: req.user._id });
    const attendedSessionIds = new Set(attendanceRecords.map(a => a.sessionId?.toString()).filter(Boolean));

    // Fetch user's personal schedule to mark isScheduled
    const user = await UserModel.findById(req.user._id).select('personalSchedule');
    const scheduledIds = new Set((user.personalSchedule || []).map(id => id.toString()));

    const enriched = sessions.map(s => ({
      _id: s._id,
      title: s.title,
      description: s.description,
      eventTitle: s.eventId?.title || 'Global Tech Summit 2026',
      date: new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: `${new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      room: s.roomName || 'Hall A',
      speaker: s.speakerId?.name || 'Keynote Speaker',
      speakerDetails: s.speakerId,
      category: s.category || 'Keynote',
      capacity: s.capacity || 500,
      expectedAttendance: s.expectedAttendance || 420,
      attendanceStatus: attendedSessionIds.has(s._id.toString()) ? 'Attended' : 'Not Attended',
      isScheduled: scheduledIds.has(s._id.toString())
    }));

    res.status(200).json({
      success: true,
      message: 'Attendee sessions retrieved',
      data: { sessions: enriched }
    });
  } catch (err) {
    next(err);
  }
});

// 11. GET /api/attendee/notifications - Notifications Stream
router.get('/notifications', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { filter = 'all' } = req.query;
    const query = { userId: req.user._id };

    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'event_updates') {
      query.type = { $in: ['event_update', 'announcement'] };
    } else if (filter === 'registration') {
      query.type = 'registration';
    } else if (filter === 'payment') {
      query.type = 'payment';
    } else if (filter === 'schedule') {
      query.type = 'schedule';
    }

    let notifications = await NotificationModel.find(query)
      .populate('eventId', 'title')
      .sort({ createdAt: -1 });

    if (notifications.length === 0) {
      // Demo notifications seed
      notifications = [
        {
          _id: 'notif-1',
          title: 'Registration Confirmed',
          message: 'Your registration for Global Tech Leadership Summit 2026 is confirmed. VIP Pass issued.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          type: 'registration',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: 'notif-2',
          title: 'Session Room Changed to Hall A',
          message: 'Your scheduled session "AI Infrastructure at Scale" has been upgraded to Grand Hall A.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          type: 'event_update',
          isRead: false,
          createdAt: new Date(Date.now() - 7200000)
        },
        {
          _id: 'notif-3',
          title: 'Payment Successful',
          message: 'Payment of ₹2,499 for VIP Pass received successfully. Invoice available in your account.',
          eventId: { title: 'Global Tech Leadership Summit 2026' },
          type: 'payment',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000)
        }
      ];
    }

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: { notifications }
    });
  } catch (err) {
    next(err);
  }
});

// 12. POST /api/attendee/notifications/:id/read - Mark as read
router.post('/notifications/:id/read', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
});

// 13. POST /api/attendee/notifications/read-all - Mark all read
router.post('/notifications/read-all', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    await NotificationModel.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
});

// 14. GET /api/attendee/feedback/available - List attended events/sessions awaiting feedback
router.get('/feedback/available', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const registrations = await RegistrationModel.find({
      attendeeId: req.user._id,
      status: 'confirmed'
    }).populate('eventId', 'title startDate endDate bannerImage');

    const submittedFeedback = await FeedbackModel.find({ attendeeId: req.user._id });
    const reviewedEventIds = new Set(submittedFeedback.map(f => f.eventId.toString()));

    const availableEvents = registrations
      .filter(r => r.eventId != null)
      .map(r => ({
        eventId: r.eventId._id,
        title: r.eventId.title || 'Conference Event',
        date: r.eventId.startDate ? new Date(r.eventId.startDate).toLocaleDateString() : 'Upcoming',
        hasSubmitted: reviewedEventIds.has(r.eventId._id.toString()),
        feedback: submittedFeedback.find(f => f.eventId.toString() === r.eventId._id.toString()) || null
      }));

    res.status(200).json({
      success: true,
      message: 'Available feedback retrieved',
      data: { availableEvents }
    });
  } catch (err) {
    next(err);
  }
});

// 15. POST /api/attendee/feedback - Submit 5-star Multi-Criteria Feedback
router.post('/feedback', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), validateRequest(['eventId']), async (req, res, next) => {
  try {
    const {
      eventId,
      sessionId = null,
      eventRating = 5,
      sessionRating = 5,
      speakerRating = 5,
      venueRating = 5,
      overallRating = 5,
      comment = '',
      likedAspects = '',
      improvements = ''
    } = req.body;
    const attendeeId = req.user._id;

    // Prevent duplicate feedback
    const existing = await FeedbackModel.findOne({
      eventId,
      sessionId: sessionId || null,
      attendeeId
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted feedback for this event.',
        error: { code: 'DUPLICATE_FEEDBACK' }
      });
    }

    const feedback = await FeedbackModel.create({
      eventId,
      sessionId: sessionId || null,
      attendeeId,
      rating: overallRating,
      eventRating,
      sessionRating,
      speakerRating,
      venueRating,
      overallRating,
      comment,
      likedAspects,
      improvements
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review helps improve future EventForge experiences.',
      data: { feedback }
    });
  } catch (err) {
    next(err);
  }
});

// 16. GET /api/attendee/settings - Profile, 8 Notifications toggles, privacy, active sessions
router.get('/settings', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Attendee settings retrieved',
      data: {
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 98765 43210',
          location: user.location || 'Hyderabad, India',
          language: user.language || 'English (India)',
          timezone: user.timezone || 'Asia/Kolkata (IST +5:30)'
        },
        notifications: user.settings || {
          emailNotifications: true,
          eventReminders: true,
          registrationUpdates: true,
          paymentUpdates: true,
          scheduleChanges: true,
          organizerAnnouncements: true,
          sessionReminders: true,
          browserNotifications: true
        },
        privacy: {
          profileVisibility: user.settings?.profileVisibility || 'registered_events_only',
          profileDiscovery: user.settings?.profileDiscovery !== false
        },
        activeSessions: [
          { device: 'Windows 11 • Chrome 128', browser: 'Chrome', lastActive: 'Active Now', current: true },
          { device: 'Android 14 • Chrome Mobile', browser: 'Chrome Mobile', lastActive: '3 hours ago', current: false }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
});

// 17. PUT /api/attendee/settings - Update profile, notifications, privacy
router.put('/settings', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { name, phone, location, language, timezone, notifications, privacy } = req.body;
    const user = await UserModel.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (language) user.language = language;
    if (timezone) user.timezone = timezone;
    if (notifications) {
      user.settings = { ...user.settings, ...notifications };
    }
    if (privacy) {
      user.settings = { ...user.settings, ...privacy };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account preferences updated successfully.',
      data: { user: user.toJSON() }
    });
  } catch (err) {
    next(err);
  }
});

// 18. PUT /api/attendee/password - Change password
router.put('/password', verifyToken, verifyRole(ROLES.ATTENDEE, ROLES.ADMIN), validateRequest(['currentPassword', 'newPassword']), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    if (req.body.newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// 19. DELETE /api/attendee/account - Delete attendee account
router.delete('/account', verifyToken, verifyRole(ROLES.ATTENDEE), async (req, res, next) => {
  try {
    await RegistrationModel.deleteMany({ attendeeId: req.user._id });
    await FeedbackModel.deleteMany({ attendeeId: req.user._id });
    await NotificationModel.deleteMany({ userId: req.user._id });
    await UserModel.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
