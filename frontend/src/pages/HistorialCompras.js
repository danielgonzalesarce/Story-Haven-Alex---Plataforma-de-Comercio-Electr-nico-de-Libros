import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCompras } from '../services/compraService';
import { isAuthenticated } from '../services/authService';
import Notification from '../components/Notification';

const HistorialCompras = () => {
  const [notification, setNotification] = React.useState(null);

  const { data: comprasData, isLoading, error } = useQuery({
    queryKey: ['compras'],
    queryFn: async () => {
      try {
        const data = await getCompras();
        // Asegurar que siempre es un array
        const compras = Array.isArray(data) ? data : [];
        return compras;
      } catch (err) {
        console.error('Error obteniendo compras:', err);
        // Si es 404, devolver array vacío en lugar de error
        if (err.response?.status === 404) {
          return [];
        }
        throw err;
      }
    },
    enabled: isAuthenticated(),
    retry: 1,
    staleTime: 30000, // Cache por 30 segundos
  });

  // Asegurar que compras siempre es un array
  const compras = Array.isArray(comprasData) ? comprasData : [];

  if (!isAuthenticated()) {
    return (
      <div className="historial-page">
        <div className="container py-5">
          <div className="alert alert-warning text-center">
            <h4>Acceso Restringido</h4>
            <p>Debes iniciar sesión para ver tu historial de compras.</p>
            <Link to="/acceder" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="historial-page">
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Solo mostrar error si no es 404 (404 se maneja devolviendo array vacío)
  if (error && error.response?.status !== 404) {
    const errorMessage = error.response?.status === 401
      ? 'Debes iniciar sesión para ver tu historial de compras.'
      : error.message || 'Ocurrió un error al cargar tu historial de compras';
    
    return (
      <div className="historial-page">
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Error al cargar el historial</h4>
            <p>{errorMessage}</p>
            {error.response?.status === 401 && (
              <Link to="/acceder" className="btn btn-primary mt-3">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="historial-page">
      <div className="container py-4">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="historial-title mb-0">
            <i className="fas fa-history me-2"></i>Mi Historial de Compras
          </h1>
          <Link to="/" className="btn btn-outline-primary">
            <i className="fas fa-arrow-left me-2"></i>Volver al Catálogo
          </Link>
        </div>

        {!isLoading && compras.length === 0 ? (
          <div className="historial-vacio">
            <div className="text-center py-5">
              <div className="historial-empty-icon mb-4">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h3 className="mb-3">Aún no tienes compras realizadas</h3>
              <p className="text-muted mb-4">
                Cuando realices tu primera compra desde el carrito, aparecerá aquí en tu historial.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/carrito" className="btn btn-primary btn-lg">
                  <i className="fas fa-shopping-cart me-2"></i>Ver Mi Carrito
                </Link>
                <Link to="/" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-book me-2"></i>Explorar Catálogo
                </Link>
              </div>
            </div>
          </div>
        ) : !isLoading && compras.length > 0 ? (
          <div className="historial-compras">
            {compras.map((compra) => (
              <div key={compra.id} className="compra-card">
                <div className="compra-header">
                  <div className="compra-info">
                    <h3 className="compra-numero">
                      <i className="fas fa-receipt me-2"></i>
                      Compra #{compra.id}
                    </h3>
                    <div className="compra-meta">
                      <span className="compra-fecha">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(compra.fecha_compra).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="compra-estado badge bg-success">
                        {compra.estado === 'completada' ? 'Completada' : compra.estado}
                      </span>
                      <span className="compra-metodo badge bg-info">
                        <i className="fas fa-credit-card me-1"></i>
                        {compra.metodo_pago || 'Stripe'}
                      </span>
                    </div>
                  </div>
                  <div className="compra-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">${parseFloat(compra.total).toFixed(2)}</span>
                  </div>
                </div>
                <div className="compra-items">
                  <h5 className="items-title">
                    <i className="fas fa-box me-2"></i>
                    Productos ({compra.total_items || compra.items?.length || 0})
                  </h5>
                  <div className="items-list">
                    {compra.items && compra.items.map((item) => {
                      const imagenUrl = `/images/${item.producto_imagen || item.producto?.imagen}`;
                      return (
                        <div key={item.id} className="compra-item">
                          <div className="compra-item-image">
                            <img
                              src={imagenUrl}
                              alt={item.producto_nombre || item.producto?.nombre}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x100?text=Imagen';
                              }}
                            />
                          </div>
                          <div className="compra-item-content">
                            <h6 className="compra-item-nombre">
                              {item.producto_nombre || item.producto?.nombre}
                            </h6>
                            <div className="compra-item-details">
                              <span>Cantidad: {item.cantidad}</span>
                              <span>Precio unitario: ${parseFloat(item.precio_unitario).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="compra-item-subtotal">
                            ${parseFloat(item.subtotal).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HistorialCompras;

