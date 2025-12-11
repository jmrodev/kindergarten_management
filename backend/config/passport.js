const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const initializePassport = (pool) => { // <-- New function definition
    // Solo configurar Google OAuth si las credenciales están presentes
    const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

    if (isGoogleConfigured) {
        passport.serializeUser((user, done) => {
            // Convert BigInt to string for session serialization
            done(null, user.id.toString());
        });

        passport.deserializeUser(async (id, done) => {
            let conn;
            try {
                conn = await pool.getConnection();
                const rows = await conn.query('SELECT * FROM parent_portal_users WHERE id = ?', [id]);
                if (rows.length > 0) {
                    // Agregar la bandera google_user para indicar que es un usuario del portal de padres
                    const user = rows[0];
                    user.google_user = true;
                    user.parent_portal_user = true;
                    done(null, user);
                } else {
                    done(null, null);
                }
            } catch (error) {
                done(error, null);
            } finally {
                if (conn) conn.release();
            }
        });

        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/parent-portal/auth/google/callback'
        }, async (accessToken, refreshToken, profile, done) => {
            let conn;
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const googleId = profile.id;

                conn = await pool.getConnection();
                const rows = await conn.query(
                    'SELECT * FROM parent_portal_users WHERE google_id = ?',
                    [googleId]
                );

                if (rows.length > 0) {
                    // Usuario existente
                    return done(null, rows[0]);
                } else {
                    // Crear nuevo usuario
                    const result = await conn.query(
                        `INSERT INTO parent_portal_users (google_id, email, name, created_at)
                         VALUES (?, ?, ?, NOW())`,
                        [googleId, email, name]
                    );

                    const newUser = {
                        id: result.insertId,
                        google_id: googleId,
                        email: email,
                        name: name
                    };

                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, null);
            } finally {
                if (conn) conn.release();
            }
        }));

        console.log('✅ Google OAuth configurado para Portal de Padres');
    } else {
        console.log('⚠️  Portal de Padres deshabilitado - Configure GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env para habilitarlo');
    }
}; // <-- End of new function

const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET; // Keep this for server.js conditional logic

module.exports = { initializePassport, passport, isGoogleConfigured };
