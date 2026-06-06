let io;

// Socket.io stub for when package is not installed
const createStubServer = () => ({
  to: (room) => ({
    emit: (event, data) => {
      console.log(`[Socket Stub] Would emit '${event}' to room '${room}'`);
    }
  }),
  on: (event, handler) => {
    console.log(`[Socket Stub] Would handle '${event}'`);
  },
});

export const initSocketServer = async (server) => {
  try {
    const { Server } = await import('socket.io');
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PATCH'],
      },
    });

    io.on('connection', (socket) => {
      socket.on('joinRoom', (room) => {
        socket.join(room);
      });

      socket.on('sendMessage', (message) => {
        if (message?.room) {
          io.to(message.room).emit('receiveMessage', message);
        }
      });

      socket.on('notification', (notification) => {
        if (notification?.userId) {
          io.to(notification.userId).emit('notification', notification);
        }
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
  } catch (err) {
    console.log('[Socket.io] Package not found, using stub server for testing');
    io = createStubServer();
  }
};

export const getIo = () => io;
