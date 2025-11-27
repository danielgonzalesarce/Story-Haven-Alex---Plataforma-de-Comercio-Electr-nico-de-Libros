import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Notification from '../components/Notification';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío (en producción esto iría al backend)
    setNotification({
      message: 'Gracias por contactarnos. Te responderemos pronto.',
      type: 'success'
    });
    setFormData({
      nombre: '',
      email: '',
      asunto: '',
      mensaje: ''
    });
  };

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <div className="contacto-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <Link to="/" className="btn-back">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
              <h1 className="contacto-hero-title">
                <span className="contacto-hero-icon">
                  <i className="fas fa-envelope"></i>
                </span>
                Contáctanos
              </h1>
              <p className="contacto-hero-subtitle">
                Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div className="contacto-hero-image">
                <i className="fas fa-headset"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="row g-4">
              {/* Información de Contacto */}
              <div className="col-lg-5">
                <div className="contact-info-card">
                  <div className="contact-info-header">
                    <h3>
                      <i className="fas fa-info-circle me-2"></i>
                      Información de Contacto
                    </h3>
                  </div>
                  <div className="contact-info-body">
                    <div className="contact-item">
                      <div className="contact-item-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="contact-item-content">
                        <h5>Email</h5>
                        <a href="mailto:info@storyhaven.com">info@storyhaven.com</a>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-item-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="contact-item-content">
                        <h5>Teléfono</h5>
                        <a href="tel:+1234567890">+1 (234) 567-890</a>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="contact-item-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="contact-item-content">
                        <h5>Horario de Atención</h5>
                        <p className="mb-0">
                          Lunes - Viernes: 9:00 AM - 6:00 PM<br />
                          Sábados: 10:00 AM - 4:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <div className="col-lg-7">
                <div className="contact-form-card">
                  <div className="contact-form-header">
                    <h3>
                      <i className="fas fa-paper-plane me-2"></i>
                      Envíanos un Mensaje
                    </h3>
                    <p className="text-muted mb-0">Completa el formulario y nos pondremos en contacto contigo</p>
                  </div>
                  <div className="contact-form-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="fas fa-user me-2"></i>Nombre
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="fas fa-envelope me-2"></i>Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">
                            <i className="fas fa-tag me-2"></i>Asunto
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="asunto"
                            value={formData.asunto}
                            onChange={handleChange}
                            placeholder="¿Sobre qué quieres contactarnos?"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">
                            <i className="fas fa-comment me-2"></i>Mensaje
                          </label>
                          <textarea
                            className="form-control"
                            name="mensaje"
                            rows="6"
                            value={formData.mensaje}
                            onChange={handleChange}
                            placeholder="Escribe tu mensaje aquí..."
                            required
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-contact-submit w-100">
                            <i className="fas fa-paper-plane me-2"></i>Enviar Mensaje
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;

