const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access.',
        error: { code: 'UNAUTHORIZED' }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks permission for this resource.`,
        error: { code: 'FORBIDDEN', requiredRoles: allowedRoles }
      });
    }

    next();
  };
};

module.exports = verifyRole;
