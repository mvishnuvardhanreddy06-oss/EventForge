const express = require('express');
const router = express.Router();
const VenueModel = require('../models/VenueModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/venues
router.get('/', async (req, res, next) => {
  try {
    const { organizationId, eventId, city } = req.query;
    const query = {};
    if (organizationId) query.organizationId = organizationId;
    if (eventId) query.eventId = eventId;
    if (city) query.city = new RegExp(city, 'i');

    const venues = await VenueModel.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: 'Venues retrieved successfully',
      data: { venues }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/venues/:id
router.get('/:id', async (req, res, next) => {
  try {
    const venue = await VenueModel.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.status(200).json({
      success: true,
      message: 'Venue details retrieved',
      data: { venue }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/venues
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['name', 'address', 'city', 'capacity']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    const venue = await VenueModel.create({
      ...req.body,
      organizationId: orgId
    });

    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: { venue }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/venues/:id
router.put('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    const updated = await VenueModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: { venue: updated }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/venues/:id/rooms (Add room to venue)
router.post('/:id/rooms', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['name', 'capacity']), async (req, res, next) => {
  try {
    const venue = await VenueModel.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });

    venue.rooms.push(req.body);
    await venue.save();

    res.status(201).json({
      success: true,
      message: 'Room added to venue successfully',
      data: { venue }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/venues/:id
router.delete('/:id', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), async (req, res, next) => {
  try {
    await VenueModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
