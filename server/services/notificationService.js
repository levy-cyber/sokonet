const Notification = require('../models/Notification');

class NotificationService {
  constructor() {
    this.io = null; // Set dynamically when SocketServer starts
  }

  setSocketServer(io) {
    this.io = io;
  }

  // Create notification and send via Socket
  async createNotification(userId, title, content, type = 'General', link = '') {
    try {
      const notification = await Notification.create({
        user: userId,
        title,
        content,
        type,
        link,
      });

      console.log(`[Notification Created] User: ${userId} | ${title}: ${content}`);

      // Push real-time event if socket.io is initialized
      if (this.io) {
        this.io.to(userId.toString()).emit('notification', notification);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      return null;
    }
  }
}

module.exports = new NotificationService();
