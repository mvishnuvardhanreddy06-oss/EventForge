const express = require('express');
const router = express.Router();
const SubscriptionPlanModel = require('../models/SubscriptionPlanModel');
const OrganizationModel = require('../models/OrganizationModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const validateObjectId = require('../middlewares/validateObjectId');
const { ROLES } = require('../utils/constants');

// GET /api/subscriptions/plans (Public & Admin - Get active subscription plans with subscriber counts)
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await SubscriptionPlanModel.find({ status: { $ne: 'archived' } }).sort({ price: 1 });

    // Aggregate real subscriber/organization count per plan
    const orgs = await OrganizationModel.find({}).select('subscriptionPlan');
    const planCounts = {};
    orgs.forEach(o => {
      const pName = (o.subscriptionPlan || 'Free').toLowerCase();
      planCounts[pName] = (planCounts[pName] || 0) + 1;
    });

    const populatedPlans = plans.map(p => {
      const pKey = p.name.toLowerCase();
      return {
        _id: p._id,
        id: p._id,
        name: p.name,
        price: p.price,
        billingPeriod: p.billingPeriod,
        features: p.features || [],
        limits: p.limits || {},
        status: p.status,
        subscriberCount: planCounts[pKey] || 0,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
    });

    res.status(200).json({
      success: true,
      message: 'Subscription plans retrieved successfully',
      data: { plans: populatedPlans }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions/plans (Admin - Create new subscription plan)
router.post('/plans', verifyToken, verifyRole(ROLES.ADMIN), validateRequest(['name', 'price']), async (req, res, next) => {
  try {
    const { name, price, billingPeriod = 'Monthly', features = [], limits = {}, status = 'active' } = req.body;

    const existing = await SubscriptionPlanModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A plan with this name already exists.' });
    }

    const plan = await SubscriptionPlanModel.create({
      name,
      price: Number(price),
      billingPeriod,
      features,
      limits,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: { plan }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/subscriptions/plans/:id (Admin - Update subscription plan price, features, status)
router.put('/plans/:id', verifyToken, verifyRole(ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const { name, price, billingPeriod, features, limits, status } = req.body;
    const plan = await SubscriptionPlanModel.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found.' });
    }

    if (name) plan.name = name;
    if (price !== undefined) plan.price = Number(price);
    if (billingPeriod) plan.billingPeriod = billingPeriod;
    if (features) plan.features = features;
    if (limits) plan.limits = limits;
    if (status) plan.status = status;

    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: { plan }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/subscriptions/organizations (Admin - List organizations with their active subscriptions)
router.get('/organizations', verifyToken, verifyRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const organizations = await OrganizationModel.find({})
      .sort({ createdAt: -1 });

    const subscriptions = organizations.map(org => ({
      _id: org._id,
      orgId: org._id,
      orgName: org.name,
      logo: org.logo,
      email: org.email || 'contact@organization.com',
      ownerName: 'Primary Contact',
      plan: org.subscriptionPlan || 'Free',
      status: org.isActive ? 'active' : 'suspended',
      billingCycle: 'Monthly',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: org.createdAt
    }));

    res.status(200).json({
      success: true,
      message: 'Organization subscriptions retrieved successfully',
      data: { subscriptions }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/subscriptions/organizations/:orgId/plan (Admin - Upgrade / Downgrade organization plan)
router.patch('/organizations/:orgId/plan', verifyToken, verifyRole(ROLES.ADMIN), validateObjectId('orgId'), async (req, res, next) => {
  try {
    const { planName } = req.body;
    if (!planName) {
      return res.status(400).json({ success: false, message: 'planName is required.' });
    }

    const org = await OrganizationModel.findById(req.params.orgId);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    org.subscriptionPlan = planName;
    await org.save();

    res.status(200).json({
      success: true,
      message: `Organization subscription plan updated to ${planName}`,
      data: { organization: org }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
