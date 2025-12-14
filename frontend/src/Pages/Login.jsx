import { useState } from 'react';
import LoginCard from '../components/Atoms/LoginCard';
import LoginForm from '../components/Molecules/LoginForm';
import Input from '../components/Atoms/Input';
import Button from '../components/Atoms/Button';
import Text from '../components/Atoms/Text';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Add token to future requests
        window.axios = {
          defaults: {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        };

        // Call the onLogin callback to update app state
        onLogin(data.user);
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <LoginCard>
        <LoginForm onSubmit={handleSubmit}>
          <Text variant="h3" className="form-title">Bienvenido</Text>
          
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
          
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="login-submit-btn"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </LoginForm>
      </LoginCard>
    </div>
  );
};

export default Login;