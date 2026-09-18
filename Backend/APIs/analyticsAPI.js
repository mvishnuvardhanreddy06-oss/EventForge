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
const { ROLES } = require('../utils/constants');

// GET /api/analytics/organizer/:eventId
router.get('/organizer/:eventId', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await EventModel.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

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
