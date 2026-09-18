const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/NotificationModel');
const verifyToken = require('../middlewares/verifyToken');

// GET /api/notifications
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find({ userId: req.user._id })
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await NotificationModel.countDocuments({
      userId: req.user._id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved',
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', verifyToken, async (req, res, next) => {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', verifyToken, async (req, res, next) => {
  try {
    await NotificationModel.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
