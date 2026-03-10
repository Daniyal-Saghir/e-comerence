const ErrorResponse = require('../utils/errorResponse');
const admin = require('../config/firebase');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find user in MongoDB by firebaseUid
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return next(new ErrorResponse('User not found in database', 404));
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
