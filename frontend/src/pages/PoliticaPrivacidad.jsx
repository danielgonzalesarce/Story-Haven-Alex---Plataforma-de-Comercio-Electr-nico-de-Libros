import React from 'react';
import { Link } from 'react-router-dom';

const PoliticaPrivacidad = () => {
  const sections = [
    {
      number: '01',
      title: 'Información que Recopilamos',
      icon: 'fa-database',
      content: 'Recopilamos información que nos proporcionas directamente cuando creas una cuenta, realizas una compra, te comunicas con nosotros o utilizas nuestros servicios. Esta información incluye nombre, dirección de correo electrónico, dirección postal y información de pago.'
    },
    {
      number: '02',
      title: 'Uso de la Información',
      icon: 'fa-cog',
      content: 'Utilizamos la información recopilada para procesar tus pedidos, comunicarnos contigo, mejorar nuestros servicios y personalizar tu experiencia de compra.'
    },
    {
      number: '03',
      title: 'Protección de Datos',
      icon: 'fa-shield-alt',
      content: 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.'
    },
    {
      number: '04',
      title: 'Cookies',
      icon: 'fa-cookie',
      content: 'Utilizamos cookies para mejorar tu experiencia en nuestro sitio web, analizar el tráfico y personalizar el contenido. Puedes controlar las cookies a través de la configuración de tu navegador.'
    },
    {
      number: '05',
      title: 'Tus Derechos',
      icon: 'fa-user-shield',
      content: 'Tienes derecho a acceder, rectificar, eliminar o limitar el procesamiento de tus datos personales. Puedes ejercer estos derechos contactándonos a través de nuestro formulario de contacto.'
    },
    {
      number: '06',
      title: 'Contacto',
      icon: 'fa-envelope',
      content: 'Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en privacidad@storyhaven.com'
    }
  ];

  return (
    <div className="politica-page">
      {/* Hero Section */}
      <div className="politica-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <Link to="/" className="btn-back">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
              <h1 className="politica-hero-title">
                <span className="politica-hero-icon">
                  <i className="fas fa-shield-alt"></i>
                </span>
                Política de Privacidad
              </h1>
              <p className="politica-hero-subtitle">
                Tu privacidad es importante para nosotros. Conoce cómo protegemos y utilizamos tu información.
              </p>
              <div className="politica-update">
                <i className="fas fa-calendar-alt me-2"></i>
                Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="politica-hero-image">
                <i className="fas fa-lock"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="politica-sections">
              {sections.map((section, index) => (
                <div key={index} className="politica-section-card">
                  <div className="politica-section-header">
                    <div className="politica-section-number">{section.number}</div>
                    <div className="politica-section-title-wrapper">
                      <div className="politica-section-icon">
                        <i className={`fas ${section.icon}`}></i>
                      </div>
                      <h3 className="politica-section-title">{section.title}</h3>
                    </div>
                  </div>
                  <div className="politica-section-body">
                    <p>{section.content}</p>
                    {section.number === '06' && (
                      <p className="mb-0">
                        <a href="mailto:privacidad@storyhaven.com" className="politica-email-link">
                          privacidad@storyhaven.com
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;

