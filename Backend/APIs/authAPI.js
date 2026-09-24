const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const OrganizationModel = require('../models/OrganizationModel');
const generateToken = require('../utils/generateToken');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');
const validateObjectId = require('../middlewares/validateObjectId');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// POST /api/auth/register
router.post('/register', validateRequest(['name', 'email', 'password']), async (req, res, next) => {
  try {
    const { name, email, password, role, phone, interests } = req.body;

    // Public self-registration is strictly restricted to ATTENDEE only
    if (role && role !== ROLES.ATTENDEE) {
      return res.status(403).json({
        success: false,
        message: 'Public self-registration is restricted to attendees only. Elevated roles (Admin, Organizer, Staff, Speaker, Sponsor) require administrative provisioning.',
        error: { code: 'FORBIDDEN_ROLE_REGISTRATION', attemptedRole: role }
      });
    }

    // Password complexity enforcement
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
        error: { code: 'WEAK_PASSWORD' }
      });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
        error: { code: 'EMAIL_ALREADY_EXISTS' }
      });
    }

    // Always create as ATTENDEE, never assign organizationId from public registration
    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password,
      role: ROLES.ATTENDEE,
      organizationId: null,
      phone: phone || '',
      interests: Array.isArray(interests) ? interests : ['Technology', 'Artificial Intelligence', 'Business']
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validateRequest(['email', 'password']), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email.toLowerCase() }).populate('organizationId');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        error: { code: 'INVALID_CREDENTIALS' }
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
        error: { code: 'INVALID_CREDENTIALS' }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact platform administrator.',
        error: { code: 'ACCOUNT_DEACTIVATED' }
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Client session tokens cleared.',
    data: {}
  });
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id).populate('organizationId');
    res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const { name, phone, interests, profileImage } = req.body;
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (Array.isArray(interests)) user.interests = interests;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/users (admin or organizer listing team/users)
router.get('/users', verifyToken, verifyRole(ROLES.ADMIN, ROLES.ORGANIZER), async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (req.user.role === ROLES.ORGANIZER) {
      if (!req.user.organizationId) {
        return res.status(200).json({
          success: true,
          message: 'Users fetched successfully',
          data: { users: [] }
        });
      }
      // Force organizationId strictly from authenticated user's organization - never from query!
      query.organizationId = req.user.organizationId;
      // Organizer can only query roles pertinent to their organization
      if (role && [ROLES.STAFF, ROLES.SPEAKER, ROLES.ORGANIZER].includes(role)) {
        query.role = role;
      } else if (!role) {
        query.role = { $in: [ROLES.STAFF, ROLES.SPEAKER, ROLES.ORGANIZER] };
      }
    } else if (req.user.role === ROLES.ADMIN) {
      if (req.query.organizationId) {
        query.organizationId = req.query.organizationId;
      }
      if (role) query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await UserModel.find(query).populate('organizationId').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: { users }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/auth/users/:id/status (admin)
router.patch('/users/:id/status', verifyToken, verifyRole(ROLES.ADMIN), validateObjectId('id'), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
