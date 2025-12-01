import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';
import Notification from '../components/Notification';

const Acceder = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' o 'register'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData);
      setNotification({ message: 'Inicio de sesión exitoso', type: 'success' });
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.error || error.response?.data?.detail || 'Error al iniciar sesión';
      setNotification({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.password2) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await register(registerData);
      setNotification({ message: 'Registro exitoso', type: 'success' });
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (error) {
      const errors = error.response?.data;
      let message = 'Error al registrar usuario';
      
      if (errors) {
        if (typeof errors === 'string') {
          message = errors;
        } else if (errors.username) {
          message = `Usuario: ${Array.isArray(errors.username) ? errors.username[0] : errors.username}`;
        } else if (errors.email) {
          message = `Email: ${Array.isArray(errors.email) ? errors.email[0] : errors.email}`;
        } else if (errors.password) {
          message = `Contraseña: ${Array.isArray(errors.password) ? errors.password[0] : errors.password}`;
        } else if (errors.non_field_errors) {
          message = Array.isArray(errors.non_field_errors) ? errors.non_field_errors[0] : errors.non_field_errors;
        }
      }
      
      setNotification({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="acceder-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <section className="acceder-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <div className="card shadow-lg acceder-card">
                <div className="card-body p-0">
                  {/* Tabs */}
                  <div className="acceder-tabs">
                    <button
                      className={`acceder-tab ${activeTab === 'login' ? 'active' : ''}`}
                      onClick={() => setActiveTab('login')}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </button>
                    <button
                      className={`acceder-tab ${activeTab === 'register' ? 'active' : ''}`}
                      onClick={() => setActiveTab('register')}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Crear Cuenta
                    </button>
                  </div>

                  {/* Login Form */}
                  {activeTab === 'login' && (
                    <div className="acceder-form-container p-4 p-md-5">
                      <h2 className="acceder-title mb-4">Bienvenido de Nuevo</h2>
                      <p className="acceder-subtitle mb-4">Inicia sesión para continuar</p>
                      <form onSubmit={handleLoginSubmit} autoComplete="off">
                        <div className="mb-3">
                          <label htmlFor="login-username" className="form-label">
                            <i className="fas fa-user me-2"></i>Usuario o Email
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="login-username"
                            name="username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required
                            placeholder="Ingresa tu usuario o correo electrónico"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="login-password" className="form-label">
                            <i className="fas fa-lock me-2"></i>Contraseña
                          </label>
                          <input
                            type="password"
                            className="form-control form-control-lg"
                            id="login-password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            placeholder="Ingresa tu contraseña"
                            autoComplete="new-password"
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100 acceder-submit-btn"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Iniciando sesión...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-sign-in-alt me-2"></i>
                              Iniciar Sesión
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Register Form */}
                  {activeTab === 'register' && (
                    <div className="acceder-form-container p-4 p-md-5">
                      <h2 className="acceder-title mb-4">Crea tu Cuenta</h2>
                      <p className="acceder-subtitle mb-4">Únete a nuestra comunidad de lectores</p>
                      <form onSubmit={handleRegisterSubmit} autoComplete="off">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="register-username" className="form-label">
                              <i className="fas fa-user me-2"></i>Usuario *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="register-username"
                              name="username"
                              value={registerData.username}
                              onChange={handleRegisterChange}
                              required
                              placeholder="Elige un usuario"
                              autoComplete="off"
                              autoCapitalize="off"
                              autoCorrect="off"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="register-email" className="form-label">
                              <i className="fas fa-envelope me-2"></i>Email *
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="register-email"
                              name="email"
                              value={registerData.email}
                              onChange={handleRegisterChange}
                              required
                              placeholder="tu@email.com"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="register-first_name" className="form-label">
                              <i className="fas fa-id-card me-2"></i>Nombre
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="register-first_name"
                              name="first_name"
                              value={registerData.first_name}
                              onChange={handleRegisterChange}
                              placeholder="Tu nombre"
                              autoComplete="off"
                              autoCapitalize="off"
                              autoCorrect="off"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="register-last_name" className="form-label">
                              <i className="fas fa-id-card me-2"></i>Apellido
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="register-last_name"
                              name="last_name"
                              value={registerData.last_name}
                              onChange={handleRegisterChange}
                              placeholder="Tu apellido"
                              autoComplete="off"
                              autoCapitalize="off"
                              autoCorrect="off"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="register-password" className="form-label">
                              <i className="fas fa-lock me-2"></i>Contraseña *
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="register-password"
                              name="password"
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              required
                              placeholder="Mínimo 8 caracteres"
                              autoComplete="new-password"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="register-password2" className="form-label">
                              <i className="fas fa-lock me-2"></i>Confirmar Contraseña *
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="register-password2"
                              name="password2"
                              value={registerData.password2}
                              onChange={handleRegisterChange}
                              required
                              placeholder="Confirma tu contraseña"
                              autoComplete="new-password"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100 acceder-submit-btn"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Registrando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-user-plus me-2"></i>
                              Crear Cuenta
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Acceder;

