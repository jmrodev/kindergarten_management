// backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mariadb = require('mariadb');
const studentRoutes = require('./routes/studentRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const staffRoutes = require('./routes/staffRoutes');
const authRoutes = require('./routes/auth');
const permissionsRoutes = require('./routes/permissions');
const guardianRoutes = require('./routes/guardianRoutes');
const parentPortalRoutes = require('./routes/parentPortalRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const { AppError, errorHandler } = require('./middleware/errorHandler'); // Import AppError and errorHandler
const { passport, isGoogleConfigured } = require('./config/passport');
const { jsonSerializer } = require('./utils/serialization'); // Import jsonSerializer
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kindergarten_db',
    connectionLimit: 5
});

// Make pool available to routes
app.set('pool', pool);

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to MariaDB!');
        conn.release();
    })
    .catch(err => {
        console.error('Error connecting to MariaDB:', err);
        process.exit(1); // Exit if DB connection fails on startup
    });

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
})); // Enable CORS with credentials
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(jsonSerializer); // Use custom JSON serializer for BigInt handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos
// Solo habilitar sesiones si Google OAuth está configurado
if (isGoogleConfigured) {
    app.use(session({
        secret: process.env.SESSION_SECRET || 'kindergarten-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}

// Routes
app.use('/api/auth', authRoutes); // Auth routes (public)
app.use('/api/students', studentRoutes); // Protected in next step
app.use('/api/classrooms', classroomRoutes); // Protected in next step
app.use('/api/staff', staffRoutes); // Staff management
app.use('/api/permissions', permissionsRoutes); // Permissions management (admin/directivo only)
app.use('/api/guardians', guardianRoutes); // Guardian/tutor management
app.use('/api/enrollments', enrollmentRoutes); // Enrollment management

// Solo habilitar rutas del portal si Google OAuth está configurado
if (isGoogleConfigured) {
    app.use('/api/parent-portal', parentPortalRoutes); // Parent portal (Google OAuth)
}

// Handle undefined routes (404)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
