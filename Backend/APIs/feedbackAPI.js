const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/FeedbackModel');
const verifyToken = require('../middlewares/verifyToken');
const validateRequest = require('../middlewares/validateRequest');

// GET /api/feedback
router.get('/', async (req, res, next) => {
  try {
    const { eventId, sessionId } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;
    if (sessionId) query.sessionId = sessionId;

    const feedbackList = await FeedbackModel.find(query)
      .populate('attendeeId', 'name profileImage')
      .populate('sessionId', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Feedback records retrieved',
      data: { feedbackList }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/feedback (Submit feedback - duplicate prevention enforced)
router.post('/', verifyToken, validateRequest(['eventId', 'rating']), async (req, res, next) => {
  try {
    const { eventId, sessionId = null, rating, comment } = req.body;
    const attendeeId = req.user._id;

    // Prevent duplicate feedback
    const existing = await FeedbackModel.findOne({
      eventId,
      sessionId: sessionId || null,
      attendeeId
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted feedback for this session/event.',
        error: { code: 'DUPLICATE_FEEDBACK' }
      });
    }

    const feedback = await FeedbackModel.create({
      eventId,
      sessionId: sessionId || null,
      attendeeId,
      rating: Number(rating),
      comment: comment || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been submitted.',
      data: { feedback }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/feedback/stats/:eventId
router.get('/stats/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const list = await FeedbackModel.find({ eventId });
    
    const total = list.length;
    const avg = total > 0 ? +(list.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : 5.0;
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(f => {
      if (distribution[f.rating] !== undefined) distribution[f.rating] += 1;
    });

    res.status(200).json({
      success: true,
      message: 'Feedback metrics calculated',
      data: {
        total,
        averageRating: avg,
        distribution
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
