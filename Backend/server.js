const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const errorHandler = require('./middlewares/errorHandler');

// Import all 17 REST APIs
const authAPI = require('./APIs/authAPI');
const organizationAPI = require('./APIs/organizationAPI');
const eventAPI = require('./APIs/eventAPI');
const venueAPI = require('./APIs/venueAPI');
const sessionAPI = require('./APIs/sessionAPI');
const speakerAPI = require('./APIs/speakerAPI');
const sponsorAPI = require('./APIs/sponsorAPI');
const sponsorshipAPI = require('./APIs/sponsorshipAPI');
const ticketAPI = require('./APIs/ticketAPI');
const registrationAPI = require('./APIs/registrationAPI');
const attendanceAPI = require('./APIs/attendanceAPI');
const announcementAPI = require('./APIs/announcementAPI');
const couponAPI = require('./APIs/couponAPI');
const feedbackAPI = require('./APIs/feedbackAPI');
const notificationAPI = require('./APIs/notificationAPI');
const analyticsAPI = require('./APIs/analyticsAPI');
const aiAPI = require('./APIs/aiAPI');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB Database
connectDB();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventForge Backend API is running smoothly',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Mount the 17 REST API routes
app.use('/api/auth', authAPI);
app.use('/api/organizations', organizationAPI);
app.use('/api/events', eventAPI);
app.use('/api/venues', venueAPI);
app.use('/api/sessions', sessionAPI);
app.use('/api/speakers', speakerAPI);
app.use('/api/sponsors', sponsorAPI);
app.use('/api/sponsorships', sponsorshipAPI);
app.use('/api/tickets', ticketAPI);
app.use('/api/registrations', registrationAPI);
app.use('/api/attendance', attendanceAPI);
app.use('/api/announcements', announcementAPI);
app.use('/api/coupons', couponAPI);
app.use('/api/feedback', feedbackAPI);
app.use('/api/notifications', notificationAPI);
app.use('/api/analytics', analyticsAPI);
app.use('/api/ai', aiAPI);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  EventForge Server Running on Port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=============================================`);
});

module.exports = { app, server };
