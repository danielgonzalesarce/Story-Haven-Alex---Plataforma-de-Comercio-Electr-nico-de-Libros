import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFavoritos, eliminarFavorito, limpiarFavoritos } from '../services/favoritosService';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadFavoritos();
  }, []);

  const loadFavoritos = () => {
    setLoading(true);
    try {
      const productosFavoritos = getFavoritos();
      setFavoritos(productosFavoritos);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      setNotification({
        message: 'Error al cargar tus favoritos',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritoChange = () => {
    loadFavoritos();
  };

  const handleEliminarFavorito = (productoId) => {
    eliminarFavorito(productoId);
    loadFavoritos();
    setNotification({
      message: 'Producto eliminado de favoritos',
      type: 'success'
    });
  };

  const handleLimpiarFavoritos = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos tus favoritos?')) {
      limpiarFavoritos();
      loadFavoritos();
      setNotification({
        message: 'Todos los favoritos han sido eliminados',
        type: 'success'
      });
    }
  };

  return (
    <div className="favoritos-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <section className="favoritos-section py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="section-title mb-2">Mis Favoritos</h1>
                  <p className="section-subtitle mb-0">
                    {favoritos.length === 0 
                      ? 'No tienes productos favoritos aún' 
                      : `Tienes ${favoritos.length} producto${favoritos.length !== 1 ? 's' : ''} en favoritos`}
                  </p>
                </div>
                {favoritos.length > 0 && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleLimpiarFavoritos}
                  >
                    <i className="fas fa-trash me-2"></i>Limpiar Todo
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : favoritos.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-favoritos">
                <i className="fas fa-heart fa-5x text-muted mb-4"></i>
                <h3 className="mb-3">No tienes favoritos aún</h3>
                <p className="text-muted mb-4">
                  Explora nuestro catálogo y agrega productos a tus favoritos haciendo clic en el ícono de corazón
                </p>
                <Link to="/" className="btn btn-primary btn-lg">
                  <i className="fas fa-shopping-bag me-2"></i>Explorar Catálogo
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {favoritos.map((producto) => (
                <div key={producto.id} className="col-md-4 col-lg-3">
                  <ProductCard 
                    producto={producto} 
                    onFavoritoChange={handleFavoritoChange}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favoritos;

