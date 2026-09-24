const express = require('express');
const router = express.Router();
const EventModel = require('../models/EventModel');
const RegistrationModel = require('../models/RegistrationModel');
const SessionModel = require('../models/SessionModel');
const TicketModel = require('../models/TicketModel');
const FeedbackModel = require('../models/FeedbackModel');
const SponsorshipModel = require('../models/SponsorshipModel');
const UserModel = require('../models/UserModel');
const OrganizationModel = require('../models/OrganizationModel');
const AttendanceModel = require('../models/AttendanceModel');
const calculateAnalytics = require('../utils/calculateAnalytics');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateObjectId = require('../middlewares/validateObjectId');
const { ROLES } = require('../utils/constants');

// GET /api/analytics/organizer/dashboard (Aggregate overview for authenticated organizer)
router.get('/organizer/dashboard', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    let eventQuery = {};
    if (req.user.role === ROLES.ORGANIZER) {
      const orConditions = [{ organizerId: req.user._id }];
      if (req.user.organizationId) {
        orConditions.push({ organizationId: req.user.organizationId });
      }
      eventQuery.$or = orConditions;
    }

    const orgEvents = await EventModel.find(eventQuery)
      .populate('venueId', 'name city')
      .sort({ startDate: 1 });

    const eventIds = orgEvents.map(e => e._id);
    const now = new Date();

    const totalEvents = orgEvents.length;
    const upcomingEvents = orgEvents.filter(e => new Date(e.startDate) >= now).length;
    const activeEvents = orgEvents.filter(e => e.status === 'published' || e.status === 'ongoing').length;

    // Registrations & Revenue
    const allRegistrations = await RegistrationModel.find({ eventId: { $in: eventIds } })
      .populate('attendeeId', 'name email profileImage phone')
      .populate('ticketId', 'name price')
      .populate('eventId', 'title')
      .sort({ createdAt: -1 });

    const totalRegistrations = allRegistrations.length;
    const confirmedRegs = allRegistrations.filter(r => r.status === 'confirmed');
    const totalRevenue = confirmedRegs.reduce((sum, r) => sum + (r.finalAmount || 0), 0);
    const totalCheckedIn = allRegistrations.filter(r => r.checkedIn).length;

    // Compute fill percentage per event
    const eventStats = orgEvents.map(e => {
      const evRegs = allRegistrations.filter(r => r.eventId?._id?.toString() === e._id.toString());
      const regCount = evRegs.length;
      const capacity = e.capacity || 1000;
      const capacityPercent = capacity > 0 ? Math.min(100, Math.round((regCount / capacity) * 100)) : 0;
      return {
        _id: e._id,
        id: e._id,
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        venue: e.venueId?.name || e.venueId?.city || 'Virtual',
        currentRegistrations: regCount,
        maxCapacity: capacity,
        capacityPercent,
        status: e.status
      };
    });

    // Upcoming sessions
    const upcomingSessions = await SessionModel.find({
      eventId: { $in: eventIds },
      endTime: { $gte: now },
      status: { $ne: 'cancelled' }
    })
      .populate('speakerId', 'name designation company profileImage')
      .populate('eventId', 'title')
      .sort({ startTime: 1 })
      .limit(6);

    res.status(200).json({
      success: true,
      message: 'Organizer dashboard analytics retrieved successfully',
      data: {
        summary: {
          totalEvents,
          upcomingEvents,
          activeEvents,
          totalRegistrations,
          totalRevenue,
          totalCheckedIn,
          attendanceRate: totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0
        },
        events: eventStats,
        recentRegistrations: allRegistrations.slice(0, 10),
        upcomingSessions
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/organizer/:eventId
router.get('/organizer/:eventId', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('eventId'), async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Verify organizer event ownership
    if (req.user.role === ROLES.ORGANIZER) {
      const isOwner = (event.organizationId && req.user.organizationId && event.organizationId.toString() === req.user.organizationId.toString()) ||
                      (event.organizerId && event.organizerId.toString() === req.user._id.toString());
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not manage this event.',
          error: { code: 'FORBIDDEN_EVENT_ACCESS' }
        });
      }
    }

    const registrations = await RegistrationModel.find({ eventId }).populate('ticketId');
    const sessions = await SessionModel.find({ eventId });
    const tickets = await TicketModel.find({ eventId });
    const feedback = await FeedbackModel.find({ eventId });
    const sponsorships = await SponsorshipModel.find({ eventId }).populate('packageId');

    const coreMetrics = calculateAnalytics(registrations, sessions, tickets, feedback);

    // Ticket breakdown for charts
    const ticketMetrics = tickets.map(t => ({
      name: t.name,
      sold: t.sold,
      remaining: t.remaining,
      revenue: t.sold * t.price,
      price: t.price
    }));

    // Session popularity based on registrations or attendances
    const sessionStats = [];
    for (const session of sessions) {
      const attendanceCount = await AttendanceModel.countDocuments({ sessionId: session._id });
      sessionStats.push({
        id: session._id,
        title: session.title,
        category: session.category,
        capacity: session.capacity,
        attendees: attendanceCount
      });
    }

    // Sponsor deliverables completion rate
    let totalDeliverables = 0;
    let completedDeliverables = 0;
    sponsorships.forEach(s => {
      (s.deliverables || []).forEach(d => {
        totalDeliverables += 1;
        if (d.status === 'completed') completedDeliverables += 1;
      });
    });
    const sponsorCompletionRate = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 100;

    res.status(200).json({
      success: true,
      message: 'Organizer analytics compiled successfully',
      data: {
        eventTitle: event.title,
        capacity: event.capacity,
        ...coreMetrics,
        tickets: ticketMetrics,
        sessions: sessionStats,
        sponsorMetrics: {
          totalSponsorships: sponsorships.length,
          sponsorCompletionRate,
          totalDeliverables,
          completedDeliverables
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/platform (Admin platform statistics)
router.get('/platform', verifyToken, verifyRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const totalOrganizations = await OrganizationModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const totalEvents = await EventModel.countDocuments();
    const activeEvents = await EventModel.countDocuments({ status: { $in: ['published', 'ongoing'] } });
    const totalRegistrations = await RegistrationModel.countDocuments();
    const totalRevenueResult = await RegistrationModel.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const usersByRole = await UserModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Platform analytics retrieved',
      data: {
        totalOrganizations,
        totalUsers,
        totalEvents,
        activeEvents,
        totalRegistrations,
        totalRevenue,
        usersByRole
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
