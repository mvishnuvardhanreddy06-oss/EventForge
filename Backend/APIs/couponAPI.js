const express = require('express');
const router = express.Router();
const CouponModel = require('../models/CouponModel');
const EventModel = require('../models/EventModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const validateObjectId = require('../middlewares/validateObjectId');
const { ROLES } = require('../utils/constants');

// Helper to verify event ownership
const isAuthorizedForEvent = (event, user) => {
  if (!event || !user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.organizationId && event.organizationId && user.organizationId.toString() === event.organizationId.toString()) return true;
  if (event.organizerId && user._id && event.organizerId.toString() === user._id.toString()) return true;
  return false;
};

// GET /api/coupons
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const query = {};
    if (eventId) {
      if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ success: false, message: 'Invalid eventId format' });
      }
      query.eventId = eventId;
    }
    const coupons = await CouponModel.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Coupons retrieved',
      data: { coupons }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/coupons
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['eventId', 'code', 'discountValue', 'expiryDate']), async (req, res, next) => {
  try {
    const { eventId } = req.body;
    if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: 'Invalid eventId format' });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Associated event not found' });
    }

    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create coupons for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    const coupon = await CouponModel.create({
      ...req.body,
      code: req.body.code.toUpperCase()
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/coupons/validate (Validate coupon before registration)
router.post('/validate', validateRequest(['eventId', 'code', 'ticketPrice']), async (req, res, next) => {
  try {
    const { eventId, code, ticketPrice } = req.body;

    if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid eventId format',
        error: { code: 'INVALID_OBJECT_ID' }
      });
    }

    const coupon = await CouponModel.findOne({
      eventId,
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code or code does not apply to this event.',
        error: { code: 'INVALID_COUPON' }
      });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired.',
        error: { code: 'COUPON_EXPIRED' }
      });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit has been reached.',
        error: { code: 'COUPON_LIMIT_REACHED' }
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (ticketPrice * (coupon.discountValue / 100));
    } else {
      discount = coupon.discountValue;
    }

    const finalPrice = Math.max(0, ticketPrice - discount);

    res.status(200).json({
      success: true,
      message: 'Coupon code applied successfully',
      data: {
        coupon,
        discount: Math.round(discount * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100
      }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/coupons/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const event = await EventModel.findById(coupon.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Associated event not found' });
    }

    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete coupons for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    await CouponModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Coupon removed',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
