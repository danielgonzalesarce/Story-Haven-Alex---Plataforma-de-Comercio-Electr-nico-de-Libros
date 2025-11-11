import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Notification from '../components/Notification';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await register(formData);
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
    <div className="container my-5">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Registro de Usuario</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="username" className="form-label">
                      Usuario *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="first_name" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="last_name" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password2" className="form-label">
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
              <div className="text-center">
                <p className="mb-0">
                  ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;

