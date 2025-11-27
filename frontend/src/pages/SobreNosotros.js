import React from 'react';
import { Link } from 'react-router-dom';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-page">
      {/* Hero Section */}
      <div className="sobre-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <Link to="/" className="btn-back">
                <i className="fas fa-arrow-left me-2"></i>Volver al Inicio
              </Link>
              <h1 className="sobre-hero-title">
                <span className="sobre-hero-icon">
                  <i className="fas fa-book-open"></i>
                </span>
                Sobre Nosotros
              </h1>
              <p className="sobre-hero-subtitle">
                Tu librería online donde cada página cuenta una historia única
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div className="sobre-hero-image">
                <i className="fas fa-book-reader"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Historia Section */}
            <div className="info-card mb-5">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <i className="fas fa-history"></i>
                </div>
                <h2 className="info-card-title">Nuestra Historia</h2>
              </div>
              <div className="info-card-body">
                <p className="info-card-lead">
                  Story Haven Alex nació de la pasión por compartir historias que inspiran, 
                  emocionan y transforman. Somos más que una librería; somos un refugio para 
                  los amantes de la lectura.
                </p>
                <p>
                  Desde clásicos literarios hasta los últimos lanzamientos de mangas, 
                  desde novelas gráficas que desafían la imaginación hasta cómics que 
                  capturan la esencia de nuestros héroes favoritos. En Story Haven Alex, 
                  creemos que cada historia merece ser contada y cada lector merece encontrar 
                  exactamente lo que busca.
                </p>
                <p className="mb-0">
                  Únete a nuestra comunidad de lectores apasionados y descubre por qué 
                  decimos que aquí, cada página es una puerta a otro mundo.
                </p>
              </div>
            </div>

            {/* Misión y Valores Grid */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="info-card h-100">
                  <div className="info-card-header">
                    <div className="info-card-icon info-card-icon-mission">
                      <i className="fas fa-bullseye"></i>
                    </div>
                    <h2 className="info-card-title">Nuestra Misión</h2>
                  </div>
                  <div className="info-card-body">
                    <p className="mb-0">
                      Facilitar el acceso a libros de calidad, fomentar la lectura y crear 
                      una comunidad donde los amantes de los libros puedan descubrir nuevas 
                      historias y compartir sus experiencias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="info-card h-100">
                  <div className="info-card-header">
                    <div className="info-card-icon info-card-icon-vision">
                      <i className="fas fa-eye"></i>
                    </div>
                    <h2 className="info-card-title">Nuestra Visión</h2>
                  </div>
                  <div className="info-card-body">
                    <p className="mb-0">
                      Ser la librería online de referencia, reconocida por nuestra selección 
                      cuidadosa de títulos y nuestro compromiso con la comunidad lectora.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Valores Section */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon info-card-icon-values">
                  <i className="fas fa-star"></i>
                </div>
                <h2 className="info-card-title">Nuestros Valores</h2>
              </div>
              <div className="info-card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="value-item">
                      <div className="value-icon">
                        <i className="fas fa-award"></i>
                      </div>
                      <div className="value-content">
                        <h4>Calidad</h4>
                        <p>Seleccionamos cuidadosamente cada libro en nuestro catálogo para garantizar la mejor experiencia de lectura.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value-item">
                      <div className="value-icon">
                        <i className="fas fa-universal-access"></i>
                      </div>
                      <div className="value-content">
                        <h4>Accesibilidad</h4>
                        <p>Hacemos que los libros sean accesibles para todos, sin importar su ubicación o presupuesto.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value-item">
                      <div className="value-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="value-content">
                        <h4>Comunidad</h4>
                        <p>Construimos una comunidad de lectores apasionados que comparten su amor por los libros.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="value-item">
                      <div className="value-icon">
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div className="value-content">
                        <h4>Innovación</h4>
                        <p>Utilizamos tecnología moderna para mejorar la experiencia de compra y descubrimiento.</p>
                      </div>
                    </div>
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

export default SobreNosotros;

