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
const enrollmentManagementRoutes = require('./routes/enrollmentManagementRoutes');
const lotteryRoutes = require('./routes/lotteryRoutes');
const roleRoutes = require('./routes/roleRoutes');
const meetingMinutesRoutes = require('./routes/meetingMinutesRoutes');
const vaccinationRecordRoutes = require('./routes/vaccinationRecordRoutes');
const documentReviewRoutes = require('./routes/documentReviewRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // Import dashboard routes
const healthInsuranceRoutes = require('./routes/healthInsuranceRoutes');
const pediatricianRoutes = require('./routes/pediatricianRoutes');
const { AppError, errorHandler } = require('./middleware/errorHandler');
const { jsonSerializer } = require('./utils/serialization'); // Import jsonSerializer
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const { pool } = require('./db');

// Make pool available to routes
app.set('pool', pool);

// Initialize Passport with the pool - REMOVED
// if (isGoogleConfigured) {
//     initializePassport(pool);
// }


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
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
})); // Enable CORS with credentials
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(jsonSerializer); // Use custom JSON serializer for BigInt handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos
// Sessions and Passport removed as Google Auth is no longer used
// However, if we need session for something else, we can re-enable it.
// For now, JWT is stateless.


// Routes
app.use('/api/auth', authRoutes); // Auth routes (public)
app.use('/api/students', studentRoutes); // Protected in next step
app.use('/api/classrooms', classroomRoutes); // Protected in next step
app.use('/api/staff', staffRoutes); // Staff management
app.use('/api/roles', roleRoutes); // Role management
app.use('/api/permissions', permissionsRoutes); // Permissions management (admin/directivo only)
app.use('/api/guardians', guardianRoutes); // Guardian/tutor management
app.use('/api/enrollments', enrollmentRoutes); // Enrollment management
app.use('/api/enrollment-management', enrollmentManagementRoutes); // Enrollment management for admin review
app.use('/api/lottery', lotteryRoutes); // Lottery list management
app.use('/api/meeting-minutes', meetingMinutesRoutes); // Meeting minutes management
app.use('/api/vaccination-records', vaccinationRecordRoutes); // Vaccination records management
app.use('/api/document-reviews', documentReviewRoutes); // Document reviews management
app.use('/api/attendance', attendanceRoutes); // Attendance management
app.use('/api/calendar', calendarRoutes); // Calendar management
app.use('/api/activities', activityRoutes); // Activities management
app.use('/api/dashboard', dashboardRoutes); // Dashboard statistics
app.use('/api/health-insurances', healthInsuranceRoutes); // Health insurance providers management
app.use('/api/pediatricians', pediatricianRoutes); // Pediatricians management

app.use('/api/parent-portal', parentPortalRoutes); // Parent portal (Standard Auth)


// Handle undefined routes (404)
app.use((req, res, next) => {
    // Ignorar ciertas rutas comunes que pueden ser solicitadas por clientes
    if (req.originalUrl === '/ws' || req.originalUrl === '/ws/' || req.path === '/ws') {
        // No lanzar error para conexiones WebSocket no manejadas
        return res.status(404).json({ error: 'WebSocket endpoint not available' });
    }
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
