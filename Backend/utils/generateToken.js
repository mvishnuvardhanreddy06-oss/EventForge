const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    },
    process.env.JWT_SECRET || 'eventforge_fallback_secret_2026',
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
