const express = require('express');
const router = express.Router();
const TicketModel = require('../models/TicketModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/tickets
router.get('/', async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;

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
router.get('/:id', async (req, res, next) => {
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
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const updated = await TicketModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Ticket not found' });
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
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
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
