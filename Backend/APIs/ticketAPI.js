const express = require('express');
const router = express.Router();
const TicketModel = require('../models/TicketModel');
const EventModel = require('../models/EventModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const validateObjectId = require('../middlewares/validateObjectId');
const { ROLES } = require('../utils/constants');

// Helper to check event ownership / authorization
const isAuthorizedForEvent = (event, user) => {
  if (!event || !user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.organizationId && event.organizationId && user.organizationId.toString() === event.organizationId.toString()) return true;
  if (event.organizerId && user._id && event.organizerId.toString() === user._id.toString()) return true;
  return false;
};

// GET /api/tickets
router.get('/', async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const query = {};
    if (eventId) {
      if (!require('mongoose').Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ success: false, message: 'Invalid eventId format' });
      }
      query.eventId = eventId;
    }

    const tickets = await TicketModel.find(query).sort({ price: 1 });
    res.status(200).json({
      success: true,
      message: 'Tickets retrieved successfully',
      data: { tickets }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/tickets/:id
router.get('/:id', validateObjectId('id'), async (req, res, next) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({
      success: true,
      message: 'Ticket details retrieved',
      data: { ticket }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tickets
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['eventId', 'name', 'price', 'quantity', 'saleEnd']), async (req, res, next) => {
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
        message: 'You are not authorized to manage tickets for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    const ticket = await TicketModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Ticket tier created successfully',
      data: { ticket }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/tickets/:id
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const event = await EventModel.findById(ticket.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Associated event not found' });
    }

    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify tickets for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    const updated = await TicketModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      message: 'Ticket tier updated successfully',
      data: { ticket: updated }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tickets/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const ticket = await TicketModel.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const event = await EventModel.findById(ticket.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Associated event not found' });
    }

    if (!isAuthorizedForEvent(event, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete tickets for this event.',
        error: { code: 'FORBIDDEN_EVENT_ACCESS' }
      });
    }

    await TicketModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Ticket tier deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
