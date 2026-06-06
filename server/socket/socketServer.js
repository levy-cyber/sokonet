const Message = require('../models/Message');
const notificationService = require('../services/notificationService');

const initSocketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Bind to notification service so it can push real-time alerts
  notificationService.setSocketServer(io);

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Join personal user room for targeted notifications/chats
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`User ${userId} joined room ${userId}`);
      }
    });

    // Handle real-time messaging
    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
      try {
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender receiver', 'name avatar');

        // Broadcast to receiver room and sender room
        io.to(receiverId.toString()).emit('messageReceived', populatedMessage);
        io.to(senderId.toString()).emit('messageSent', populatedMessage);

        // Send a system notification alert to the receiver if they are inactive or for general audit
        await notificationService.createNotification(
          receiverId,
          'New Chat Message',
          content.length > 50 ? `${content.substring(0, 50)}...` : content,
          'General',
          `/chat`
        );
      } catch (error) {
        console.error('Socket message error:', error.message);
      }
    });

    // Handle Rider GPS tracking coordinates broadcast
    socket.on('updateRiderLocation', ({ riderId, orderId, latitude, longitude }) => {
      console.log(`Rider ${riderId} updated location for Order ${orderId}: ${latitude}, ${longitude}`);
      
      // Broadcast location updates to anyone listening to this order room (e.g. the buyer/seller)
      io.to(orderId.toString()).emit('riderLocationUpdate', {
        riderId,
        latitude,
        longitude,
      });
    });

    // Join order room for live updates
    socket.on('joinOrder', (orderId) => {
      socket.join(orderId.toString());
      console.log(`Joined order tracking room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocketServer;
