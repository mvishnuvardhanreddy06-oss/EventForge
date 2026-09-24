const express = require('express');
const router = express.Router();
const RegistrationModel = require('../models/RegistrationModel');
const EventModel = require('../models/EventModel');
const TicketModel = require('../models/TicketModel');
const CouponModel = require('../models/CouponModel');
const UserModel = require('../models/UserModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { generateQRToken, createRegistrationQR } = require('../services/qrService');
const { sendNotification } = require('../services/notificationService');
const { sendRegistrationConfirmation } = require('../services/emailService');
const { ROLES, REGISTRATION_STATUS } = require('../utils/constants');

// GET /api/registrations (Filter by event or current attendee)
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { eventId, status, attendeeId } = req.query;
    const query = {};
    
    // Attendees only see their own registrations
    if (req.user.role === ROLES.ATTENDEE) {
      query.attendeeId = req.user._id;
    } else if (req.user.role === ROLES.ORGANIZER) {
      const orgEvents = await EventModel.find({
        $or: [
          { organizationId: req.user.organizationId },
          { organizerId: req.user._id }
        ]
      }).select('_id');
      const eventIds = orgEvents.map(e => e._id);
      if (eventId) {
        if (!eventIds.some(id => id.toString() === eventId.toString())) {
          return res.status(403).json({ success: false, message: 'Forbidden: You do not manage this event' });
        }
        query.eventId = eventId;
      } else {
        query.eventId = { $in: eventIds };
      }
      if (attendeeId) query.attendeeId = attendeeId;
    } else if (req.user.role === ROLES.ADMIN) {
      if (eventId) query.eventId = eventId;
      if (attendeeId) query.attendeeId = attendeeId;
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions to view registrations' });
    }

    if (status) query.status = status;

    const registrations = await RegistrationModel.find(query)
      .populate('eventId', 'title startDate endDate bannerImage venueId')
      .populate('attendeeId', 'name email profileImage')
      .populate('ticketId', 'name price benefits')
      .populate('selectedSessions', 'title startTime endTime category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Registrations retrieved successfully',
      data: { registrations }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/registrations/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const registration = await RegistrationModel.findById(req.params.id)
      .populate('eventId')
      .populate('attendeeId', 'name email phone profileImage')
      .populate('ticketId')
      .populate('selectedSessions');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Security check: attendee can only access own registration
    if (req.user.role === ROLES.ATTENDEE && registration.attendeeId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this registration' });
    }

    // Security check: organizer can only view registrations for their own organization's events
    if (req.user.role === ROLES.ORGANIZER) {
      const event = await EventModel.findById(registration.eventId);
      const isOwner = event && (
        (event.organizationId && req.user.organizationId && event.organizationId.toString() === req.user.organizationId.toString()) ||
        (event.organizerId && event.organizerId.toString() === req.user._id.toString())
      );
      if (!isOwner) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this registration' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Registration details retrieved',
      data: { registration }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/registrations (Register attendee for event)
router.post('/', verifyToken, validateRequest(['eventId', 'ticketId']), async (req, res, next) => {
  try {
    const { eventId, ticketId, couponCode, selectedSessions = [] } = req.body;
    const attendeeId = req.user._id;

    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (['cancelled', 'completed'].includes(event.status)) {
      return res.status(400).json({ success: false, message: `Event is currently ${event.status}. Registration closed.` });
    }

    // Check if already registered
    const existingReg = await RegistrationModel.findOne({
      eventId,
      attendeeId,
      status: { $in: [REGISTRATION_STATUS.CONFIRMED, REGISTRATION_STATUS.PENDING, REGISTRATION_STATUS.WAITLISTED] }
    });

    if (existingReg) {
      return res.status(409).json({
        success: false,
        message: `You are already registered for this event with status: ${existingReg.status}.`,
        data: { registration: existingReg }
      });
    }

    // Ticket verification
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket || ticket.eventId.toString() !== eventId) {
      return res.status(404).json({ success: false, message: 'Valid ticket tier not found for this event' });
    }

    // Check total event registrations vs capacity
    const confirmedCount = await RegistrationModel.countDocuments({
      eventId,
      status: REGISTRATION_STATUS.CONFIRMED
    });

    const isCapacityFull = confirmedCount >= event.capacity || ticket.remaining <= 0;

    let status = REGISTRATION_STATUS.CONFIRMED;
    if (isCapacityFull) {
      status = REGISTRATION_STATUS.WAITLISTED;
    } else if (event.approvalRequired) {
      status = REGISTRATION_STATUS.PENDING;
    }

    // Calculate pricing and apply coupon
    let finalAmount = ticket.price;
    let couponId = null;

    if (couponCode && !isCapacityFull) {
      const coupon = await CouponModel.findOne({
        eventId,
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() }
      });

      if (coupon && coupon.usedCount < coupon.maxUses) {
        couponId = coupon._id;
        if (coupon.discountType === 'percentage') {
          finalAmount = Math.max(0, finalAmount - (finalAmount * (coupon.discountValue / 100)));
        } else {
          finalAmount = Math.max(0, finalAmount - coupon.discountValue);
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // Generate unique Registration Number
    const regNum = `EF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrToken = generateQRToken(regNum, eventId, attendeeId);
    const qrCodeUrl = await createRegistrationQR(qrToken, regNum, event.title);

    const isFree = finalAmount === 0;
    const paymentStatus = isFree ? 'free' : 'pending';
    const regStatus = isFree ? status : (status === REGISTRATION_STATUS.WAITLISTED ? REGISTRATION_STATUS.WAITLISTED : REGISTRATION_STATUS.PENDING);

    const registration = await RegistrationModel.create({
      eventId,
      attendeeId,
      ticketId,
      registrationNumber: regNum,
      status: regStatus,
      paymentStatus,
      couponId,
      finalAmount,
      qrToken,
      qrCodeUrl,
      selectedSessions
    });

    // Update ticket count only if confirmed
    if (regStatus === REGISTRATION_STATUS.CONFIRMED) {
      ticket.sold += 1;
      ticket.remaining = Math.max(0, ticket.quantity - ticket.sold);
      if (ticket.remaining === 0) ticket.status = 'sold_out';
      await ticket.save();
    }

    // Dispatch notifications
    await sendNotification({
      userId: attendeeId,
      eventId,
      title: status === REGISTRATION_STATUS.WAITLISTED ? 'Added to Event Waitlist' : 'Registration Confirmed!',
      message: status === REGISTRATION_STATUS.WAITLISTED
        ? `Capacity is currently reached. You are on the waitlist for ${event.title}. You will be notified automatically once a slot opens.`
        : `Your registration for ${event.title} is confirmed. Registration #: ${regNum}`,
      type: 'registration'
    });

    if (status === REGISTRATION_STATUS.CONFIRMED) {
      await sendRegistrationConfirmation(req.user.email, {
        eventTitle: event.title,
        registrationNumber: regNum,
        ticketName: ticket.name,
        finalAmount
      });
    }

    res.status(201).json({
      success: true,
      message: status === REGISTRATION_STATUS.WAITLISTED
        ? 'Event capacity reached. You have been added to the waitlist.'
        : 'Registration completed successfully',
      data: { registration }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/registrations/:id/cancel (Attendee cancels -> Waitlist promotion occurs!)
router.patch('/:id/cancel', verifyToken, async (req, res, next) => {
  try {
    const registration = await RegistrationModel.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    if (req.user.role === ROLES.ATTENDEE && registration.attendeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const wasConfirmed = registration.status === REGISTRATION_STATUS.CONFIRMED;
    registration.status = REGISTRATION_STATUS.CANCELLED;
    await registration.save();

    // If this registration was confirmed, promote next waitlisted user!
    if (wasConfirmed) {
      // Release ticket counter
      const ticket = await TicketModel.findById(registration.ticketId);
      if (ticket) {
        ticket.sold = Math.max(0, ticket.sold - 1);
        ticket.remaining = ticket.quantity - ticket.sold;
        if (ticket.status === 'sold_out' && ticket.remaining > 0) {
          ticket.status = 'active';
        }
        await ticket.save();
      }

      // Find next in waitlist
      const nextWaitlisted = await RegistrationModel.findOne({
        eventId: registration.eventId,
        status: REGISTRATION_STATUS.WAITLISTED
      }).sort({ createdAt: 1 });

      if (nextWaitlisted) {
        nextWaitlisted.status = REGISTRATION_STATUS.CONFIRMED;
        await nextWaitlisted.save();

        if (ticket) {
          ticket.sold += 1;
          ticket.remaining = Math.max(0, ticket.quantity - ticket.sold);
          await ticket.save();
        }

        // Notify promoted attendee
        await sendNotification({
          userId: nextWaitlisted.attendeeId,
          eventId: nextWaitlisted.eventId,
          title: 'You have been promoted from the Waitlist!',
          message: `Great news! A slot opened up and your registration #${nextWaitlisted.registrationNumber} is now confirmed!`,
          type: 'registration'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
      data: { registration }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/registrations/:id/approve (Organizer approval)
router.patch('/:id/approve', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const registration = await RegistrationModel.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    registration.status = REGISTRATION_STATUS.CONFIRMED;
    await registration.save();

    await sendNotification({
      userId: registration.attendeeId,
      eventId: registration.eventId,
      title: 'Registration Approved',
      message: `Your registration #${registration.registrationNumber} has been approved by the organizer.`,
      type: 'registration'
    });

    res.status(200).json({
      success: true,
      message: 'Registration approved successfully',
      data: { registration }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/registrations/:id/ticket (Get attendee ticket & QR)
router.get('/:id/ticket', verifyToken, async (req, res, next) => {
  try {
    const registration = await RegistrationModel.findById(req.params.id)
      .populate('eventId')
      .populate('attendeeId', 'name email')
      .populate('ticketId');

    if (!registration) return res.status(404).json({ success: false, message: 'Ticket not found' });

    res.status(200).json({
      success: true,
      message: 'Ticket details retrieved',
      data: { registration }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
