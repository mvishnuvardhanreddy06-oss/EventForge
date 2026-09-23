const mongoose = require('mongoose');

/**
 * Middleware factory to validate Mongoose ObjectIds in request parameters.
 * Prevents CastError exceptions from reaching the database query layer.
 * 
 * @param  {...string} paramNames - Parameter names to validate (default: ['id'])
 * @returns {Function} Express middleware
 */
const validateObjectId = (...paramNames) => {
  const paramsToCheck = paramNames.length > 0 ? paramNames : ['id'];

  return (req, res, next) => {
    for (const param of paramsToCheck) {
      const val = req.params[param];
      if (val !== undefined && val !== null) {
        if (!mongoose.Types.ObjectId.isValid(val)) {
          return res.status(400).json({
            success: false,
            message: `Invalid identifier format for '${param}'. Must be a 24-character hexadecimal string.`,
            error: {
              code: 'INVALID_OBJECT_ID',
              parameter: param,
              value: String(val).slice(0, 50)
            }
          });
        }
      }
    }
    next();
  };
};

module.exports = validateObjectId;
