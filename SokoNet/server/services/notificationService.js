import { getIo } from '../socket/socketServer.js';

export const sendNotificationToUser = (userId, payload) => {
  try {
    const io = getIo();
    if (!io) return;
    // emit to a room named after userId
    io.to(userId).emit('notification', payload);
  } catch (err) {
    console.warn('Failed to send notification', err);
  }
};
import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, category = 'system', meta = {}) => {
  return Notification.create({
    user: userId,
    title,
    message,
    category,
    meta,
  });
};
