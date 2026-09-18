/**
 * EventForge - Utility test socket client
 * Can be run with: node client.js <jwt_token>
 */
const { io } = require('socket.io-client');

const token = process.argv[2] || '';
const socket = io('http://localhost:5000', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('Connected to EventForge WebSocket server:', socket.id);
});

socket.on('notification', (data) => {
  console.log('Received notification:', data);
});

socket.on('announcement', (data) => {
  console.log('Received announcement:', data);
});

socket.on('checkin_update', (data) => {
  console.log('Check-in update received:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
