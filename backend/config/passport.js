const passport = require('passport');

// This file is kept for compatibility but Google Auth has been removed.
// Future cleanups can remove this file if no other strategies are added.

const initializePassport = (pool) => {
    // Google Auth removed.
    console.log('Login standard habilitado para Portal de Padres.');
};

const isGoogleConfigured = false; // Always false now

module.exports = { initializePassport, passport, isGoogleConfigured };
