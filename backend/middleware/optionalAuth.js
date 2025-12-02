// middleware/optionalAuth.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const { AppError } = require('./errorHandler');
const { getConnection } = require('../db');

// Middleware for optional authentication (doesn't fail if no token is present)
const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kindergarten_secret');

      // Convertir decoded.id a BigInt si es necesario para la consulta
      const userId = typeof decoded.id === 'number' ? BigInt(decoded.id) : decoded.id;

      // Get user from token
      // For parent portal users, we might need to handle differently
      try {
        const user = await Staff.getById(userId);

        if (!user || !user.is_active) {
          // This might be a parent portal user, let's continue without a full user object
          req.user = { 
            id: decoded.id, 
            email: decoded.email, 
            name: decoded.name,
            google_user: decoded.google_user
          };
        } else {
          req.user = user;
        }
      } catch (err) {
        // If it's not a staff user, it might be a parent portal user
        // In this case, we'll just set the decoded information
        req.user = { 
          id: decoded.id, 
          email: decoded.email, 
          name: decoded.name,
          google_user: decoded.google_user
        };
      }

      next();
    } catch (error) {
      // If token is invalid, continue without user info (not authenticated)
      req.user = null;
      next();
    }
  } else {
    // No token provided, continue without user info
    req.user = null;
    next();
  }
};

module.exports = {
  optionalAuth
};