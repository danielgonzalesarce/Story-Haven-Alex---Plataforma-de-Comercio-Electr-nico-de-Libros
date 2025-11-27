import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PreguntasFrecuentes = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      pregunta: '¿Cómo puedo realizar una compra?',
      respuesta: 'Simplemente navega por nuestro catálogo, añade los productos que te interesen al carrito y procede al checkout. Necesitarás crear una cuenta para completar la compra.'
    },
    {
      pregunta: '¿Cuáles son los métodos de pago disponibles?',
      respuesta: 'Actualmente aceptamos pagos con tarjeta de crédito/débito a través de Stripe. Próximamente agregaremos más opciones como PayPal, Google Pay y Apple Pay.'
    },
    {
      pregunta: '¿Puedo comprar sin crear una cuenta?',
      respuesta: 'Puedes explorar el catálogo y añadir productos al carrito sin cuenta, pero necesitarás registrarte para completar la compra y acceder a funciones como el historial de compras.'
    },
    {
      pregunta: '¿Cómo puedo rastrear mi pedido?',
      respuesta: 'Una vez completada tu compra, recibirás un email de confirmación con los detalles. Puedes ver todas tus compras en la sección "Historial" de tu cuenta.'
    },
    {
      pregunta: '¿Ofrecen envío internacional?',
      respuesta: 'Actualmente realizamos envíos a nivel nacional. Estamos trabajando para expandir nuestros servicios de envío internacional próximamente.'
    },
    {
      pregunta: '¿Puedo devolver un producto?',
      respuesta: 'Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en su estado original. Contacta con nuestro equipo de atención al cliente para iniciar el proceso.'
    },
    {
      pregunta: '¿Cómo puedo añadir productos a favoritos?',
      respuesta: 'Haz clic en el icono de corazón que aparece en cada tarjeta de producto. Los productos guardados aparecerán en tu sección de "Favoritos".'
    },
    {
      pregunta: '¿Los precios incluyen impuestos?',
      respuesta: 'Los precios mostrados son finales e incluyen todos los impuestos aplicables según tu ubicación.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <div className="faq-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <Link to="/" className="btn-back">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
              <h1 className="faq-hero-title">
                <span className="faq-hero-icon">
                  <i className="fas fa-question-circle"></i>
                </span>
                Preguntas Frecuentes
              </h1>
              <p className="faq-hero-subtitle">
                Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div className="faq-hero-image">
                <i className="fas fa-comments"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item-modern">
                  <div 
                    className={`faq-question-modern ${openIndex === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="faq-question-content">
                      <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                      <h5 className="faq-question-text">{faq.pregunta}</h5>
                    </div>
                    <div className="faq-toggle">
                      <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
                    </div>
                  </div>
                  <div className={`faq-answer-modern ${openIndex === index ? 'open' : ''}`}>
                    <div className="faq-answer-content">
                      <p>{faq.respuesta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-cta">
              <div className="faq-cta-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h4>¿No encuentras lo que buscas?</h4>
              <p>Nuestro equipo está aquí para ayudarte con cualquier pregunta adicional.</p>
              <Link to="/contacto" className="btn btn-faq-contact">
                <i className="fas fa-paper-plane me-2"></i>Contactar con Nosotros
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;

