const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: process.env.JWT_SECRET is required to generate authentication tokens.');
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
