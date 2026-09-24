const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const verifyToken = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: { code: 'UNAUTHORIZED' }
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[CRITICAL] JWT_SECRET environment variable is missing.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
        error: { code: 'CONFIG_ERROR' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user not found.',
        error: { code: 'USER_NOT_FOUND' }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
        error: { code: 'ACCOUNT_DEACTIVATED' }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[JWT Verification Failure]:', error.name, error.message);
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: { code: 'INVALID_TOKEN' }
    });
  }
};

module.exports = verifyToken;
