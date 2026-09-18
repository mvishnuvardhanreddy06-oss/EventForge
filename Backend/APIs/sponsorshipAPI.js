const express = require('express');
const router = express.Router();
const SponsorshipPackageModel = require('../models/SponsorshipPackageModel');
const SponsorshipModel = require('../models/SponsorshipModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/sponsorships/packages (List packages for event)
router.get('/packages', async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const query = eventId ? { eventId } : {};
    const packages = await SponsorshipPackageModel.find(query).sort({ price: -1 });
    res.status(200).json({
      success: true,
      message: 'Sponsorship packages retrieved',
      data: { packages }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sponsorships/packages (Create package)
router.post('/packages', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['eventId', 'name', 'price']), async (req, res, next) => {
  try {
    const pkg = await SponsorshipPackageModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Sponsorship package created successfully',
      data: { package: pkg }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sponsorships (List sponsorships)
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { eventId, sponsorId } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;
    if (sponsorId) query.sponsorId = sponsorId;

    const sponsorships = await SponsorshipModel.find(query)
      .populate('sponsorId')
      .populate('packageId')
      .populate('eventId', 'title startDate endDate');

    res.status(200).json({
      success: true,
      message: 'Sponsorships retrieved successfully',
      data: { sponsorships }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sponsorships (Assign package)
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['sponsorId', 'eventId', 'packageId']), async (req, res, next) => {
  try {
    const { sponsorId, eventId, packageId, deliverables = [] } = req.body;
    const defaultDeliverables = deliverables.length > 0 ? deliverables : [
      { title: 'Brand Logo on Official Banner', dueDate: new Date(Date.now() + 7 * 86400000), status: 'pending' },
      { title: 'Executive Keynote Slot Confirmation', dueDate: new Date(Date.now() + 14 * 86400000), status: 'pending' },
      { title: 'Exhibition Hall Booth Setup', dueDate: new Date(Date.now() + 21 * 86400000), status: 'pending' },
      { title: 'Marketing Collateral in Attendee Kit', dueDate: new Date(Date.now() + 25 * 86400000), status: 'pending' }
    ];

    const sponsorship = await SponsorshipModel.create({
      sponsorId,
      eventId,
      packageId,
      deliverables: defaultDeliverables,
      paymentStatus: 'paid',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Sponsorship contract established successfully',
      data: { sponsorship }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/sponsorships/:id/deliverable/:deliverableId
router.patch('/:id/deliverable/:deliverableId', verifyToken, async (req, res, next) => {
  try {
    const { status } = req.body;
    const sponsorship = await SponsorshipModel.findById(req.params.id);
    if (!sponsorship) return res.status(404).json({ success: false, message: 'Sponsorship record not found' });

    const deliverable = sponsorship.deliverables.id(req.params.deliverableId);
    if (!deliverable) return res.status(404).json({ success: false, message: 'Deliverable not found' });

    deliverable.status = status;
    if (status === 'completed') {
      deliverable.completedAt = new Date();
    }
    await sponsorship.save();

    res.status(200).json({
      success: true,
      message: 'Deliverable status updated',
      data: { sponsorship }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
