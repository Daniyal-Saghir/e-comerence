const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const admin = require('../config/firebase');

// @desc    Sync Firebase User to MongoDB (Login / Register)
// @route   POST /api/v1/auth/sync
// @access  Public
exports.syncUser = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user exists in DB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      // Create new user in DB
      user = await User.create({
        name: decodedToken.name || decodedToken.email.split('@')[0],
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        avatar: decodedToken.picture || '',
        role: 'customer' // Default role
      });
    }

    if (!user.isActive) {
      return next(new ErrorResponse('User account is deactivated', 403));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Sync User Error:', error);
    return next(new ErrorResponse('Not authorized or token expired', 401));
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  // req.user is set in protect middleware
  res.status(200).json({
    success: true,
    data: req.user
  });
};
