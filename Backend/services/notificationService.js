const NotificationModel = require('../models/NotificationModel');
const { getIO } = require('../config/socket');

const sendNotification = async ({ userId, eventId = null, title, message, type = 'info' }) => {
  try {
    const notification = await NotificationModel.create({
      userId,
      eventId,
      title,
      message,
      type
    });

    const io = getIO();
    if (io) {
      io.to(`user:${userId}`).emit('notification', notification);
    }

    return notification;
  } catch (err) {
    console.error('Notification dispatch error:', err.message);
    return null;
  }
};

const broadcastEventNotification = async ({ eventId, title, message, type = 'announcement', attendeeUserIds = [] }) => {
  try {
    const notifications = attendeeUserIds.map(userId => ({
      userId,
      eventId,
      title,
      message,
      type
    }));

    if (notifications.length > 0) {
      await NotificationModel.insertMany(notifications);
    }

    const io = getIO();
    if (io) {
      io.to(`event:${eventId}`).emit('announcement', {
        eventId,
        title,
        message,
        type,
        publishedAt: new Date()
      });
    }

    return true;
  } catch (err) {
    console.error('Broadcast notification error:', err.message);
    return false;
  }
};

module.exports = {
  sendNotification,
  broadcastEventNotification
};
