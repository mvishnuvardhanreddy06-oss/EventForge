const express = require('express');
const router = express.Router();
const SpeakerModel = require('../models/SpeakerModel');
const SessionModel = require('../models/SessionModel');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');

// GET /api/speakers
router.get('/', async (req, res, next) => {
  try {
    const { organizationId, search } = req.query;
    const query = {};
    if (organizationId) query.organizationId = organizationId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const speakers = await SpeakerModel.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      message: 'Speakers retrieved successfully',
      data: { speakers }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/speakers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const speaker = await SpeakerModel.findById(req.params.id).populate('userId', 'email');
    if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

    const sessions = await SessionModel.find({ speakerId: speaker._id }).populate('eventId', 'title startDate endDate');

    res.status(200).json({
      success: true,
      message: 'Speaker profile retrieved',
      data: { speaker, sessions }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/speakers
router.post('/', verifyToken, verifyRole(ROLES.ORGANIZER, ROLES.ADMIN), validateRequest(['name', 'designation']), async (req, res, next) => {
  try {
    const orgId = req.body.organizationId || req.user.organizationId;
    const speaker = await SpeakerModel.create({
      ...req.body,
      organizationId: orgId
    });

    res.status(201).json({
      success: true,
      message: 'Speaker profile created successfully',
      data: { speaker }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/speakers/:id (Speaker themselves or Organizer/Admin)
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const speaker = await SpeakerModel.findById(req.params.id);
    if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

    // Check permission
    const isOwner = speaker.userId && speaker.userId.toString() === req.user._id.toString();
    const isManager = [ROLES.ORGANIZER, ROLES.ADMIN].includes(req.user.role);
    if (!isOwner && !isManager) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot modify this speaker profile' });
    }

    const updated = await SpeakerModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      success: true,
      message: 'Speaker profile updated successfully',
      data: { speaker: updated }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/speakers/:id/availability
router.put('/:id/availability', verifyToken, async (req, res, next) => {
  try {
    const speaker = await SpeakerModel.findById(req.params.id);
    if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

    if (Array.isArray(req.body.availability)) {
      speaker.availability = req.body.availability;
      await speaker.save();
    }

    res.status(200).json({
      success: true,
      message: 'Speaker availability updated',
      data: { availability: speaker.availability }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
