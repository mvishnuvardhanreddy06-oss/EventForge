const express = require('express');
const router = express.Router();
const {
  generateEventDescription,
  generateSpeakerBio,
  generateSessionSummary,
  generateAnnouncement,
  generateMarketingCopy,
  generateEventHighlights
} = require('../services/aiService');
const { getPersonalizedRecommendations } = require('../services/recommendationService');
const UserModel = require('../models/UserModel');
const verifyToken = require('../middlewares/verifyToken');
const validateRequest = require('../middlewares/validateRequest');

// POST /api/ai/generate (AI Studio multi-generator)
router.post('/generate', verifyToken, validateRequest(['type']), async (req, res, next) => {
  try {
    const { type, ...payload } = req.body;
    let generatedContent = '';

    switch (type) {
      case 'event-description':
        generatedContent = await generateEventDescription(payload);
        break;
      case 'speaker-bio':
        generatedContent = await generateSpeakerBio(payload);
        break;
      case 'session-summary':
        generatedContent = await generateSessionSummary(payload);
        break;
      case 'announcement':
        generatedContent = await generateAnnouncement(payload);
        break;
      case 'marketing-copy':
        generatedContent = await generateMarketingCopy(payload);
        break;
      case 'highlights':
        generatedContent = await generateEventHighlights(payload);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown AI generation task type: ${type}`,
          error: { code: 'INVALID_AI_TASK_TYPE' }
        });
    }

    res.status(200).json({
      success: true,
      message: 'AI draft generated successfully',
      data: {
        type,
        generatedContent,
        generatedAt: new Date(),
        status: 'draft'
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/ai/recommendations/:eventId
router.get('/recommendations/:eventId', verifyToken, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const recommendations = await getPersonalizedRecommendations(req.user._id, eventId);

    res.status(200).json({
      success: true,
      message: 'Personalized recommendations generated',
      data: { recommendations }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/ai/attendee/interests (Update user interests for recommendations)
router.post('/attendee/interests', verifyToken, validateRequest(['interests']), async (req, res, next) => {
  try {
    const { interests } = req.body;
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.interests = interests;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Attendee interests saved successfully',
      data: { interests: user.interests }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
