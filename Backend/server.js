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
const attendeeAPI = require('./APIs/attendeeAPI');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { router: auditLogAPI } = require('./APIs/auditLogAPI');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Connect to MongoDB Database
connectDB();

// Production Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:", "http://localhost:*", "http://127.0.0.1:*"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Safe CORS policy
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by CORS origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Tiered Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    error: { code: 'RATE_LIMIT_EXCEEDED' }
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
    error: { code: 'AUTH_RATE_LIMIT_EXCEEDED' }
  }
});

const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many check-in scan requests, please slow down.',
    error: { code: 'SCAN_RATE_LIMIT_EXCEEDED' }
  }
});

// Mount Rate Limiters
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/attendance/scan', scanLimiter);

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
app.use('/api/attendee', attendeeAPI);
app.use('/api/audit-logs', auditLogAPI);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`  EventForge Server Running on Port ${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=============================================`);
  });
}

module.exports = { app, server };
