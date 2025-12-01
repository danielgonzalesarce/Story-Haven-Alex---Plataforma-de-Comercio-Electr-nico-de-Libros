import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const authenticated = isAuthenticated();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="row">
            {/* Sección: Sobre Nosotros */}
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="footer-brand mb-3">
                <img src="/logo.png" alt="Story Haven Alex" height="40" className="me-2" />
                <h5 className="footer-title mb-0">Story Haven Alex</h5>
              </div>
              <div className="footer-divider"></div>
              <p className="footer-text">
                Tu librería online donde cada página cuenta una historia. 
                Descubre mundos infinitos entre las páginas de nuestros libros cuidadosamente seleccionados.
              </p>
              <Link to="/sobre-nosotros" className="footer-link-more">
                Conoce más sobre nosotros <i className="fas fa-arrow-right ms-1"></i>
              </Link>
            </div>

            {/* Sección: Enlaces Rápidos */}
            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-title">Navegación</h5>
              <div className="footer-divider"></div>
              <ul className="footer-links">
                <li>
                  <Link to="/" className="footer-link">
                    <i className="fas fa-home me-2"></i>Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/categorias" className="footer-link">
                    <i className="fas fa-th-large me-2"></i>Categorías
                  </Link>
                </li>
                <li>
                  <Link to="/carrito" className="footer-link">
                    <i className="fas fa-shopping-cart me-2"></i>Carrito
                  </Link>
                </li>
                <li>
                  <Link to="/favoritos" className="footer-link">
                    <i className="fas fa-heart me-2"></i>Favoritos
                  </Link>
                </li>
                {authenticated && (
                  <li>
                    <Link to="/perfil" className="footer-link">
                      <i className="fas fa-user me-2"></i>Mi Perfil
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Sección: Información */}
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-title">Información</h5>
              <div className="footer-divider"></div>
              <ul className="footer-links">
                <li>
                  <Link to="/sobre-nosotros" className="footer-link">
                    <i className="fas fa-info-circle me-2"></i>Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="footer-link">
                    <i className="fas fa-envelope me-2"></i>Contacto
                  </Link>
                </li>
                <li>
                  <Link to="/preguntas-frecuentes" className="footer-link">
                    <i className="fas fa-question-circle me-2"></i>Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link to="/politica-privacidad" className="footer-link">
                    <i className="fas fa-shield-alt me-2"></i>Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sección: Contacto y Redes Sociales */}
            <div className="col-lg-4 col-md-6">
              <h5 className="footer-title">Contacto</h5>
              <div className="footer-divider"></div>
              <div className="footer-contact mb-4">
                <p className="footer-text mb-3">
                  <i className="fas fa-envelope me-2"></i>
                  <a href="mailto:info@storyhaven.com" className="footer-link">info@storyhaven.com</a>
                </p>
                <p className="footer-text mb-3">
                  <i className="fas fa-phone me-2"></i>
                  <a href="tel:+1234567890" className="footer-link">+1 (234) 567-890</a>
                </p>
                <p className="footer-text mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Lun - Vie: 9:00 AM - 6:00 PM
                </p>
              </div>
              <h5 className="footer-title mt-4">Síguenos</h5>
              <div className="footer-divider"></div>
              <div className="footer-social">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="footer-copyright mb-0">
                &copy; {currentYear} Story Haven Alex. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
              <p className="footer-copyright mb-0">
                Hecho con <i className="fas fa-heart text-danger"></i> para los amantes de los libros
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


