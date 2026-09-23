const express = require('express');
const router = express.Router();
const AuditLogModel = require('../models/AuditLogModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const { ROLES } = require('../utils/constants');

// Central Audit Logging Helper
async function logAuditAction({ user, action, resource, resourceId, details, req, status = 'Success' }) {
  try {
    const ipAddress = req?.ip || req?.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || 'Chrome / Windows';
    
    await AuditLogModel.create({
      user: {
        userId: user?._id,
        name: user?.name || 'System User',
        email: user?.email || 'user@eventforge.io',
        role: user?.role || 'SYSTEM'
      },
      action,
      resource,
      resourceId: String(resourceId || ''),
      details,
      ipAddress,
      device: userAgent.includes('Mobile') ? 'Mobile Device' : 'Windows PC',
      browser: userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Chrome',
      status
    });
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
}

// GET /api/audit-logs (Platform Admin only)
router.get('/', verifyToken, verifyRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const { action, resource, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (action && action !== 'all') query.action = action;
    if (resource && resource !== 'all') query.resource = resource;
    if (search) {
      query.$or = [
        { details: new RegExp(search, 'i') },
        { 'user.name': new RegExp(search, 'i') },
        { 'user.email': new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const logs = await AuditLogModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await AuditLogModel.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: {
        logs,
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  router,
  logAuditAction
};
