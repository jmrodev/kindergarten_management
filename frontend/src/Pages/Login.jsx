import { useState } from 'react';
import LoginCard from '../components/Atoms/LoginCard';
import LoginForm from '../components/Molecules/LoginForm';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import Text from '../components/Atoms/Text';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('staff'); // 'staff' or 'family'
  const [isRegistering, setIsRegistering] = useState(false); // Only for family

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }
    }

    console.log('Submitting Registration Form:', formData);

    try {
      const authService = await import('../services/authService');
      let data;

      if (userType === 'staff') {
        data = await authService.default.login({ email: formData.email, password: formData.password });
      } else {
        if (isRegistering) {
          data = await authService.default.registerParent({
            email: formData.email,
            password: formData.password,
            name: formData.name
          });
        } else {
          data = await authService.default.loginParent({ email: formData.email, password: formData.password });
        }
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      // Fix error handling to match api.js structure (err.payload)
      const message = err.payload?.error || err.message || 'Error de conexión con el servidor';
      setError(message);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserType = (type) => {
    setUserType(type);
    setIsRegistering(false);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
  };

  return (
    <div className="login-container">
      <LoginCard>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <Button
            type="button"
            variant={userType === 'staff' ? 'primary' : 'secondary'}
            onClick={() => toggleUserType('staff')}
            style={{ flex: 1 }}
          >
            Personal
          </Button>
          <Button
            type="button"
            variant={userType === 'family' ? 'primary' : 'secondary'}
            onClick={() => toggleUserType('family')}
            style={{ flex: 1 }}
          >
            Familia
          </Button>
        </div>

        <LoginForm onSubmit={handleSubmit}>
          <Text variant="h3" className="form-title">
            {userType === 'staff' ? 'Acceso Personal' : (isRegistering ? 'Registro Familia' : 'Acceso Familia')}
          </Text>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {isRegistering && (
            <Input
              label="Nombre Completo"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />

          {isRegistering && (
            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
          </Button>

          {userType === 'family' && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Button
                type="button"
                variant="text" // Assuming text variant exists or falls back to default button style but lightweight
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
              </Button>
            </div>
          )}
        </LoginForm>
      </LoginCard>
    </div >
  );
};

export default Login;