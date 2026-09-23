const mongoose = require('mongoose');
const EventModel = require('../models/EventModel');
const { ROLES } = require('../utils/constants');

const verifyEventAccess = async (req, res, next) => {
  try {
    const eventId = req.params.eventId || req.params.id || req.body.eventId;
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID parameter is required.',
        error: { code: 'EVENT_ID_REQUIRED' }
      });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event identifier format.',
        error: { code: 'INVALID_OBJECT_ID' }
      });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
        error: { code: 'EVENT_NOT_FOUND' }
      });
    }

    // Admin has global access
    if (req.user.role === ROLES.ADMIN) {
      req.event = event;
      return next();
    }

    // Organizer access verification: must match organizer ID or organization ID
    if (req.user.role === ROLES.ORGANIZER) {
      const isOrganizer = event.organizerId && event.organizerId.toString() === req.user._id.toString();
      const isOrgMember = event.organizationId && req.user.organizationId && event.organizationId.toString() === req.user.organizationId.toString();
      
      if (!isOrganizer && !isOrgMember) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not manage this event.',
          error: { code: 'UNAUTHORIZED_EVENT_ACCESS' }
        });
      }
      req.event = event;
      return next();
    }

    // Staff access verification: must belong to event's host organization
    if (req.user.role === ROLES.STAFF) {
      const isOrgMember = event.organizationId && req.user.organizationId && event.organizationId.toString() === req.user.organizationId.toString();
      if (!isOrgMember) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not assigned to this event organization.',
          error: { code: 'UNAUTHORIZED_EVENT_ACCESS' }
        });
      }
      req.event = event;
      return next();
    }

    req.event = event;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyEventAccess;
