const express = require('express');
const router = express.Router();
const OrganizationModel = require('../models/OrganizationModel');
const EventModel = require('../models/EventModel');
const UserModel = require('../models/UserModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/organizations (Admin & Organizers)
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === ROLES.ORGANIZER && req.user.organizationId) {
      query._id = req.user.organizationId;
    }
    const organizations = await OrganizationModel.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Organizations retrieved successfully',
      data: { organizations }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/organizations/:id
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const organization = await OrganizationModel.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }
    const eventCount = await EventModel.countDocuments({ organizationId: organization._id });
    const memberCount = await UserModel.countDocuments({ organizationId: organization._id });

    res.status(200).json({
      success: true,
      message: 'Organization details retrieved',
      data: {
        organization,
        stats: { eventCount, memberCount }
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/organizations (Admin)
router.post('/', verifyToken, verifyRole(ROLES.ADMIN), validateRequest(['name', 'email']), async (req, res, next) => {
  try {
    const { name, description, logo, email, phone, subscriptionPlan } = req.body;
    const organization = await OrganizationModel.create({
      name,
      description,
      logo,
      email,
      phone,
      subscriptionPlan: subscriptionPlan || 'Pro'
    });

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: { organization }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/organizations/:id (Admin or managing Organizer)
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.ADMIN && req.user.organizationId?.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions to update this organization' });
    }

    const updated = await OrganizationModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Organization not found' });

    res.status(200).json({
      success: true,
      message: 'Organization updated successfully',
      data: { organization: updated }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/organizations/:id/status (Admin)
router.patch('/:id/status', verifyToken, verifyRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const org = await OrganizationModel.findById(req.params.id);
    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

    org.isActive = !org.isActive;
    await org.save();

    res.status(200).json({
      success: true,
      message: `Organization status changed to ${org.isActive ? 'active' : 'inactive'}`,
      data: { organization: org }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
