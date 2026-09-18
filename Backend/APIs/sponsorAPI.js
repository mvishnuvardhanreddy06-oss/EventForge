const express = require('express');
const router = express.Router();
const SponsorModel = require('../models/SponsorModel');
const SponsorshipModel = require('../models/SponsorshipModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/sponsors
router.get('/', async (req, res, next) => {
  try {
    const { eventId, organizationId, status } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;
    if (organizationId) query.organizationId = organizationId;
    if (status) query.status = status;

    const sponsors = await SponsorModel.find(query)
      .populate('packageId')
      .populate('eventId', 'title startDate endDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Sponsors retrieved successfully',
      data: { sponsors }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sponsors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id)
      .populate('packageId')
      .populate('eventId');
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    const sponsorship = await SponsorshipModel.findOne({ sponsorId: sponsor._id }).populate('packageId');

    res.status(200).json({
      success: true,
      message: 'Sponsor details retrieved',
      data: { sponsor, sponsorship }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sponsors
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SPONSOR), validateRequest(['eventId', 'companyName', 'email']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    const sponsor = await SponsorModel.create({
      ...req.body,
      organizationId: orgId,
      userId: req.user.role === ROLES.SPONSOR ? req.user._id : (req.body.userId || null)
    });

    res.status(201).json({
      success: true,
      message: 'Sponsor registered successfully',
      data: { sponsor }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sponsors/:id
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    const isOwner = sponsor.userId && sponsor.userId.toString() === req.user._id.toString();
    const isManager = [ROLES.ORGANIZER, ROLES.ADMIN].includes(req.user.role);
    if (!isOwner && !isManager) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied to this sponsor profile' });
    }

    const updated = await SponsorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: 'Sponsor updated successfully',
      data: { sponsor: updated }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/sponsors/:id/assets
router.post('/:id/assets', verifyToken, validateRequest(['name', 'fileUrl']), async (req, res, next) => {
  try {
    const sponsor = await SponsorModel.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    const { name, fileUrl, assetType = 'logo' } = req.body;
    sponsor.brandAssets.push({ name, fileUrl, assetType, uploadedAt: new Date() });
    await sponsor.save();

    res.status(201).json({
      success: true,
      message: 'Brand asset uploaded successfully',
      data: { brandAssets: sponsor.brandAssets }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
