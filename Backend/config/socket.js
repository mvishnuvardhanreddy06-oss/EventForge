const { Server } = require('socket.io');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    // Join specific event room
    socket.on('join_event', (eventId) => {
      if (eventId) {
        socket.join(`event:${eventId}`);
      }
    });

    socket.on('leave_event', (eventId) => {
      if (eventId) {
        socket.leave(`event:${eventId}`);
      }
    });

    // Join specific user room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    // Join organization room
    socket.on('join_org', (orgId) => {
      if (orgId) {
        socket.join(`org:${orgId}`);
      }
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = { initSocket, getIO };
