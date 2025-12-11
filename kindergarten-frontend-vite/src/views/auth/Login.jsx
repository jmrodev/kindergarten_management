import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { PersonFill, LockFill, BoxArrowInRight, Eye, EyeSlash, Google } from 'react-bootstrap-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, initiateGoogleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const result = await login(email, password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-card">
          <div className="form-card-header bg-primary text-white text-center py-4">
            <h3 className="mb-0">
              <PersonFill className="me-2" />
              Iniciar Sesión
            </h3>
            <p className="mb-0">Sistema de Gestión - Jardín de Infantes</p>
          </div>
          <div className="form-card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="form-label">
                  <PersonFill className="me-1" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ingrese su correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">
                  <LockFill className="me-1" />
                  Contraseña
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary d-flex align-items-center justify-content-center"
                >
                  {loading ? (
                    <>
                      <span className="spinner spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <BoxArrowInRight className="me-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="d-grid mt-3">
              <button
                type="button"
                onClick={initiateGoogleLogin}
                className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                <Google className="me-2" />
                Iniciar Sesión con Google
              </button>
            </div>

            <div className="text-center mt-4">
              <small className="text-muted d-block mb-2">
                ¿Olvidó su contraseña? Contacte al administrador del sistema.
              </small>
              <small className="text-muted">
                <em>Credenciales por defecto:</em> <strong>admin@kindergarten.com</strong> / <strong>admin123</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;