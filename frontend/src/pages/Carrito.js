import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCarrito, removeFromCarrito, checkout } from '../services/cartService';
import Notification from '../components/Notification';

const Carrito = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCarrito();
  }, []);

  const loadCarrito = async () => {
    setLoading(true);
    try {
      const data = await getCarrito();
      const itemsArray = Array.isArray(data) ? data : data.results || [];
      setItems(itemsArray);
      calculateTotal(itemsArray);
    } catch (error) {
      console.error('Error cargando carrito:', error);
      setNotification({ message: 'Error al cargar el carrito', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (itemsArray) => {
    const totalCalculado = itemsArray.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal);
    }, 0);
    setTotal(totalCalculado);
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCarrito(itemId);
      setNotification({ message: 'Producto eliminado del carrito', type: 'success' });
      loadCarrito();
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      setNotification({ message: 'Error al eliminar del carrito', type: 'error' });
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await checkout();
      setNotification({
        message: response.message || 'Funcionalidad de compra actualmente en desarrollo',
        type: 'info',
      });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Funcionalidad de compra actualmente en desarrollo';
      setNotification({ message, type: 'info' });
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="display-4 mb-4">Mi Carrito</h1>

      {items.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>Tu carrito está vacío</h4>
          <p>Explora nuestro catálogo y añade productos a tu carrito.</p>
          <Link to="/" className="btn btn-primary">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {items.map((item) => {
              const imagenUrl = `/images/${item.producto.imagen}`;
              return (
                <div key={item.id} className="card mb-3 shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={imagenUrl}
                        className="img-fluid rounded-start"
                        alt={item.producto.nombre}
                        style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body">
                        <h5 className="card-title">{item.producto.nombre}</h5>
                        <p className="card-text text-muted">{item.producto.autor}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            Cantidad: {item.cantidad} | Precio unitario: $
                            {parseFloat(item.producto.precio).toFixed(2)}
                          </small>
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="text-primary mb-0">
                            Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                          </h5>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemove(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Resumen del Pedido</h5>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Total de items:</span>
                  <strong>{items.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total:</span>
                  <strong className="text-primary fs-4">${total.toFixed(2)}</strong>
                </div>
                <hr />
                <button className="btn btn-primary w-100 mb-2" onClick={handleCheckout}>
                  Proceder al Checkout
                </button>
                <Link to="/" className="btn btn-outline-secondary w-100">
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;

